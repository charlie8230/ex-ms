//  let R = require('../vendor/ramda/dist/ramda.custom');
let util = require('./util');
let generalState = require('./general-state');
const globalConfig = new generalState({debugger: debugMode, initCompleted: false, moduleSelector: '[data-module]', maxServiceDepth: 8});
//  const {stackState, stackFunctions, reset} = require('./stacks-state'); // no redux here
let Context = require('./context');
let {API, emitterAPI} = require('./events');
let {logger, log, debugMode}  = require('./logger');

let app = {
  globalConfig,
  get stacks(){
    return this.globalConfig.stack || {};
  },
  set stacks(item){
    this.globalConfig.stack = item;
  },
  get config() {
    return this.globalConfig.config;
  },
  set config(val) {
    this.globalConfig.set(val);
  },
  init(config){
    this.globalConfig.set(config);
  },
  logger,
  getElements(){
    return document.querySelectorAll(this.config.moduleSelector);
  },
  addModule(name, fn) {
    globalConfig.addToStack('modules')(name, fn);  
  },
  addService(name, fn){
    globalConfig.addToStack('services')(name, fn);  
  },
  addAction(name, fn) {
    globalConfig.addToStack('actions')(name, fn);
  },
  getModuleName(elem='',selector='') {
    let key = selector.replace(/[\[\]]/g,'');
    if (elem) {
      return elem && elem.attributes && elem.attributes[key] && elem.attributes[key].value;
    } else {
      return elem;
    }
  },
  getModule(name=''){
    let stack = this.stacks['modules'];
    return stack && stack.get(name);
  },
  startAll(){
    let stacks = this.stacks;
    let mRefs = stacks['moduleRefs'];
    mRefs.forEach(moduleInit=>{
      moduleInit['fn'] && moduleInit.fn['init'] && moduleInit.fn['init']();
      log(moduleInit, 'init');
    });
  },
  getService(name=''){
    let stack = this.stacks['services'];
    let svcFn = stack && stack.get(name);
    let svc;
    if (svcFn) {
      if ('api' in svcFn) {
        log('Got ', svcFn['name'], ' already'); // Singleton cannot be inited again
        return svcFn['api'];
      }

      // bails out on circular ref checks
      
      let svcName = svcFn['name'];
      let servicesInProgress = this.stacks['serviceInit'];
      if(servicesInProgress.size>globalConfig.maxServiceDepth) {
        log('too deep');
        return;
      }
      let circular = servicesInProgress.has(svcName);
      if (circular) {
        log('Found a circular ref!', svcName);
        return;
      } else {
        log('No circular refs', svcName);
      }
      this.stacks = {type:'serviceInit', name: svcName};
      svc = svcFn['fn'](this);  // this = app
      this.globalConfig.removeStackItem('serviceInit',svcName);
      log(this.stacks['serviceInit']);
      svcFn['api'] = svc; // ok
      return svc;
    }
  },
  getGlobal(name){
    return typeof window[name]==='undefined'?null:window[name];
  },
  getAction(name=''){
    let stack = this.stacks['actions'];
    return stack && stack.get(name);
  },
  asSubModule(){},
  runStart(){
    if (this.config['initCompleted']) {
      log('Global Init already done - exit!');
      return true;
    }    
    this.setupModules();
    this.startAll();
  },
  startModules(kickoffmsg){
    if (kickoffmsg) {
      this.on(kickoffmsg,()=>{
        this.runStart();
      });
    } else {
      this.runStart();
    }
  },
  reset(){
    this.globalConfig.reset();
  },
  setupModules() {

    let elems = this.getElements();
    elems.forEach(e=>{
      let name = this.getModuleName(e, this.config.moduleSelector);
      if (!name) return;
      let exmodule = this.getModule(name);
      
      let context = new Context(e, this, util);
      if(exmodule && exmodule['fn']) {
        let moduleFn;
        try {
          moduleFn = exmodule['fn'](context);
        } catch (e) {
          log(`Could not start ${name} on ${context}: ${e}`);
        }
         
        if (typeof moduleFn !== 'undefined') {
          if(moduleFn['onmessage']) {
            emitterAPI.onmessage(moduleFn['onmessage'], moduleFn['messages']);
          }
          // ? stack item was not added?
          let actions = moduleFn['actions'] || moduleFn['behaviors']||[];
// dedupe the actions
          if(actions && actions.length>0) {
            actions.forEach(name=>{
              let act = this.getAction(name);
              if (act && act['fn']) {
                try {
                  let process = act['fn'](context); // take context and add event delegation
                  let keys = Object.keys(process);
                  let handlers = keys.filter(val=>/on/.test(val));
/// LIST of events!!!?
                  handlers.forEach(value=>{
                    let _handler = process[value];
                    let _name = value.replace(/^on/,'');
                    context.el.addEventListener(_name,_handler);
                  });
                  log(process);
                } catch(e){
                  log(`could not start behavior ${name}: ${e}`);
                }
              }
            });
            //  returns event handlers- attach
            //  returns message handlers - 2nd type of priority << module messages! ??? - attach?
          }

          this.stacks = {type: 'moduleRefs', name, fn:moduleFn};  // fn should have lifecyle methods?
        }
      }
    });
    this.config = {initCompleted: true};
  }
};
//  Extend
Object.assign(app,emitterAPI);

module.exports = app;