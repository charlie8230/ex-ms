//  let R = require('../vendor/ramda/dist/ramda.custom');
let util = require('./util');
let GState = require('./general-state');
const {stackState, stackFunctions} = require('./stacks-state'); // no redux here
let Context = require('./context');
let {API, emitterAPI} = require('./events');
let {logger, log, debugMode}  = require('./logger');

let app = {
  globalConfig: new GState({debugger: debugMode, initCompleted: false, moduleSelector: '[data-module]'}),
  get stacks(){
    return (stackState && stackState.stack) || {};
  },
  set stacks(item){
    stackState.stack = item;
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
  getModuleName(e='',selector='') {
    let key = selector.replace(/[\[\]]/g,'');
    if (e) {
      return e && e.attributes && e.attributes[key] && e.attributes[key].value;
    } else {
      return e;
    }
  },
  getModule(name=''){
    return (this.stacks['modules']||[]).reduce((acc,val)=>((val.name===name&&val)||acc), null);
  },
  addService: stackFunctions.addToStack('services'),
  addModule: stackFunctions.addToStack('modules'),
  addAction: stackFunctions.addToStack('actions'),
  startAll(){
    let all = this.stacks['moduleRefs'];
    all.forEach(m=>{
      m && m.fn && m.fn['init'] && m.fn['init']();
      log(m, 'init');
    });
  },
  getService(name=''){
    let svcFn = (this.stacks['services']).reduce((acc, val)=>((val.name===name&&val)||acc),null);
    let svc;
    if (svcFn) {
      if ('api' in svcFn) {
        log('Got ', svcFn['name'], ' already');
        return svcFn['api'];
      }

      // bails out on circular ref checks
      
      let svcName = svcFn['name'];
      let servicesInProgress = this.stacks['serviceInit'];
      if(servicesInProgress.length>5) {
        log('too deep');
        return;
      }
      let circular = servicesInProgress.some(val=>val.name===svcName);
      if (circular) {
        log('Found a circular ref!', svcName);
        return;
      } else {
        log('No circular refs', svcName);
      }
      this.stacks = {type:'serviceInitAdd', name: svcName};
      svc = svcFn['fn'](this);
      this.stacks = {type: 'serviceInitDone', name: svcName};
      log(this.stacks['serviceInit']);
      Object.assign(svcFn, {api:svc, type:'services'}); // incomplete implementation
      return svc;
    }
  },
  getGlobal(name){
    return typeof window[name]==='undefined'?null:window[name];
  },
  getAction(name=''){
    return (this.stacks['actions']||[]).reduce((acc,val)=>((val.name===name&&val)||acc),null);
  },
  asSubModule(){},
  runStart(){    
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
  setupModules() {
    if (this.config['initCompleted']) {
      log('Global Init already done - exit!');
      return;
    }
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