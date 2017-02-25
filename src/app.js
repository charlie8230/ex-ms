
let AppState = require('./state');
let GState = require('./general-state');

let app = {

  init(globalConfig){
    this.state = new AppState(globalConfig);
    this.gstate = new GState({debugger: true});
    this.anotherState = new GState({selector:'#page'});
  },

  get(prop) {
    //  this.expr = prop;
    if(this.state) {
      return this.state.get(prop);
    }
  }

};

function counter(state=0, action) {
  switch (action.type){
    case 'INCREMENT':
      return state +1;
    case 'DECREMENT':
      return state -1;
    default:
      return state;
  }
}

const ADD_TODO = 'ADD_TODO';

function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}



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