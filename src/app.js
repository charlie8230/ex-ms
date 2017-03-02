

let GState = require('./general-state');
const stacksState = require('./stacks-state');
let Context = require('./context');
let {emitterAPI} = require('./events');
let {logger, debugMode}  = require('./logger');
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

      exmodule && exmodule['fn'] && exmodule['fn'](context);
    });
    this.config = {initCompleted: true};
  }
};

//  Extend
Object.assign(app,emitterAPI);

/*

  Needs Plugin system - requires conventions be followed returns chainable
  Needs Singleton Service
  Needs States
  Needs stacks
  Needs Public API
  Needs Modules
  Needs config
  Needs data-*
  Has Mini Pub Sub
  Allows Views (how does data flow?)
  Allows Streams
  Allows delegation
  Enable custom build
  Allows composition (rambda?)

  todo:
    short hand query All

  What about?
    XHR
    Select modern vs transpiled?crea

*/


module.exports = app;