
let AppState = require('./state');
let GState = require('./general-state');

let app = {
  globalConfig: new GState({debugger: false}),
  get config() {
    return this.globalConfig.config;
  },
  set config(val) {
    this.globalConfig.set(val);
  },
  init(config){
    this.globalConfig.set(config);
  }
};



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