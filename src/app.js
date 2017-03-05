let GState = require('./general-state');
const stacksState = require('./stacks-state');
let Context = require('./context');
let {emitterAPI} = require('./events');
let {logger, log, debugMode}  = require('./logger');
let app = {
  globalConfig: new GState({debugger: debugMode, initCompleted: false, moduleSelector: '[data-module]'}),
  get stacks(){
    return (stacksState && stacksState.stack) || {};
  },
  set stacks(item){
    stacksState.stack = item;
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
    return (this.stacks['modules']||[]).reduce((acc,val)=>((val.name===name&&val)||acc));
  },
  addService(name, fn){},
  addModule(name, fn){

  },
  getService(name=''){
    let svcFn = (this.stacks['services']).reduce((acc, val)=>((val.name===name&&val)||acc));
    let svc;
    if (svcFn) {
      if ('api' in svcFn) {
        log('Got ', svcFn['name'], ' already');
        return svcFn['api'];
      }
//  NEEDS circular ref checks
      
      let svcName = svcFn['name'];
      let servicesInProgress = this.stacks['serviceInit'];
      if(servicesInProgress.length>5) {
        console.log('too deep');
        return;
      }
      let circular = servicesInProgress.some(val=>val.name===svcName);
      if (circular) {
        console.log('Found a circular ref!', svcName);
        return;
      } else {
        console.log('No circular refs', svcName);
      }
      this.stacks = {type:'serviceInitAdd', name: svcName};
      svc = svcFn['fn'](this);
      this.stacks = {type: 'serviceInitDone', name: svcName};
      console.log(this.stacks['serviceInit']);
      Object.assign(svcFn, {api:svc, type:'services'}); // incomplete implementation
      return svc;
    }
  },
  startModules() {
    if (this.config['initCompleted']) {
      logger.log('Global Init already done - exit!');
      return;
    }
    let elems = this.getElements();
    elems.forEach(e=>{
      let name = this.getModuleName(e, this.config.moduleSelector);
      if (!name) return;
      let exmodule = this.getModule(name);
      
      let context = new Context(e);
      //  this.stacks = {}
      exmodule && exmodule['fn'] && exmodule['fn'](context);
    });
    this.config = {initCompleted: true};
  }
};

//  Extend
Object.assign(app,emitterAPI);

/*

  Needs Plugin system - requires conventions be followed returns chainable
  Services -
    Public - done
    require done
    Singleton done
  Needs States - done
  Needs stacks - done
  Needs Modules - done
  Use fetch ponyfill;
    Module should return init within a closure??
    Module context should be able to request plugin or submodule
  Needs config - done
  Needs data-* - done
  Has Mini Pub Sub - done
  Allows Views (how does data flow?)
  Allows Streams
  Allows delegation
  Enable custom build
  Allows composition (rambda?)

  todo:
    short hand query All

  What about?
    XHR - fetch


*/


module.exports = app;