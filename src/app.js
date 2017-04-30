let util = require('./util');
let generalState = require('./general-state');
const globalConfig = new generalState({debugger: debugMode, initCompleted: false, moduleSelector: '[data-module]', maxServiceDepth: 8});
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
  addBehavior(name, fn) { // T3 Adapter
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
      if(moduleInit['fn'] && moduleInit.fn['init']) {
        this.runFunction(moduleInit.fn, 'init', `Error running Init on ${moduleInit.name}`,false);
      }
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
        return;  // Too deep - bail out
      }
      let circular = servicesInProgress.has(svcName);
      if (circular) {
        return;
      }
      this.stacks = {type:'serviceInit', name: svcName};
      svc = this.runFunction(svcFn, 'fn', `Error starting service: ${svcFn.name}`, this);
      svcFn['api'] = svc; // ok
      this.globalConfig.removeStackItem('serviceInit',svcName);
      
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
  runStart(){
    if (this.config['initCompleted']) {
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
  stop(elem){
    let id = elem.dataset['_id']&& elem.dataset['_id'] || String(elem.id).replace(/module-/,'');
    if (typeof id !=='undefined'||id!=='') {
      let refs = this.stacks['moduleRefs'];
      let actionRefs = this.stacks['actionRefs'];
      if (actionRefs.has(id)) {
        let actions = actionRefs.get(id);
        actions.forEach(val=>{
          this.detachHandler(elem, val.name, val.fn);
        });
        this.globalConfig.removeStackItem('actionRefs', id);
      }
      if(refs.has(id)) {
        let moduleRef = refs.get(id);
        if(moduleRef['destroy']) {
          moduleRef.destroy();
        }
        this.globalConfig.removeStackItem('moduleRefs', id); // remove event handlers???
      } else {
        return; // no need to remove from refs
      }
    }
  },
  reset(){
    this.globalConfig.reset();
  },
  cleanUpName(item){  // Clean up an ES module name as provided by webpack into our cache
    if (item['name']) {
      let name = String(item['name']);
      let shortName = name.replace(/^.*[\\\/]/, '');
      let noExt = shortName.substr(0, shortName.lastIndexOf('.')) || shortName;
      item['name'] = `${noExt}`;
    }
    return item;
  },
  processCache(){
    if (this.cache && this.cache.length>0) {
      let cache = this.cache;
      cache.map(this.cleanUpName).forEach(e=>{
        this.stacks = e;
      });
      this.cache = null;  // clear all references
    }
  },
  _EVENT_TYPES: ['click', 'mouseover', 'mouseout', 'mousedown', 'mouseup',
			          'mouseenter', 'mouseleave', 'mousemove', 'keydown', 'keyup', 'submit', 'change',
			          'contextmenu', 'dblclick', 'input', 'focusin', 'focusout'],
  attachHandler(elem,name,handler){
    if (elem instanceof Node) {
      elem.dataset.hasEvents = true;
      elem.addEventListener(name, handler);
    }
  },
  detachHandler(elem, name, handler){
    if (elem instanceof Node) {
      elem.dataset.hasEvents = false;
      elem.removeEventListener(name, handler);
    }
  },
  collectEvents(processType, process, elem){  // process = module || behavior
    let keys = Object.keys(process);
    let handlers = keys.filter(val=>this._EVENT_TYPES.lastIndexOf(val.replace(/^on/,''))>=0).filter(val=>/on/.test(val));

    handlers.forEach(value=>{
      let _handler = process[value];
      let _name = value.replace(/^on/,'');
      let _track_name = processType + _name;
      this.attachHandler(elem,_name,_handler);
      this.stacks = {type:'actionRefs', fn: _handler, name: _name, id: elem.dataset._id};
    });
  },
  runFunction(API, name='fn', errorMsg, ...params){
    let result = void 0;
    if (name in API) {
      try {
        result = API[name](...params);
      } catch(e) {
        logger.error(errorMsg, '\n', e);
      }
    }
    return result;
  },
  setupModules() {
    
    this.processCache();  // register modules, behaviors & services that were imported as common JS

    let elems = this.getElements();
    elems.forEach(e=>{
      let name = this.getModuleName(e, this.config.moduleSelector);
      if (!name) return;
      let exmodule = this.getModule(name);
      
      let context = new Context(e, this, util);
      if(exmodule && exmodule['fn']) {
        let moduleFn;
        moduleFn = this.runFunction(exmodule, 'fn', `Error starting module ${name}`, context);
         
        if (moduleFn) {
          if(moduleFn['onmessage']) {
            emitterAPI.onmessage(moduleFn['onmessage'], moduleFn['messages']);
          }
          this.collectEvents('module', moduleFn, context.el);

          let actions = moduleFn['actions'] || moduleFn['behaviors']||[];

          if(actions && actions.length>0) {
            actions.forEach(name=>{
              let act = this.getAction(name);
              if (act && act['fn']) {
                let process = this.runFunction(act,'fn', `Error starting behavior ${name}`, context);
                if(process) {
                  let processInit = process['init'];
                  this.collectEvents('behavior', process, context.el);
                  if (processInit) {
                    this.runFunction(process,'init', `Error starting behavior ${name} init`, context);
                  }
                }
              }
            });
          }
          this.stacks = {type: 'moduleRefs', name, fn:moduleFn, id: context._id};
        }
      }
    });
    this.config = {initCompleted: true};
  }
};
//  Extend
Object.assign(app,emitterAPI);

module.exports = app;