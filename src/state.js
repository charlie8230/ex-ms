let { createStore, combineReducers } = require('redux');

//  let immutable = require('immutable');
//  stacks

// initial state
const s = {
  services: [], // DOM, AJAX, PUBSUB << Interact with Redux? >> Rx Streams>>? Templating (plugin)>>
  modules: [],
  plugins: [],
  globalConfig: {}
};
// 
const ACTIONS = {
  SET_VAL: 'SET_VAL',
  GET_VAL: 'GET_VAL',
  GET_ALL: 'GET_ALL'
};

// reducer
// store
// subscribe
// dispatch

//  API

let defaultState = {
  globalSettings: {
    debug: true
  } // immutable ?
}

window.immutable = immutable;


module.exports = class AppState {
  constructor(data={}){
    this.data = data;
  }

  get(name) {
    return this.data[name];
  }

  get allData(){
    return this.data;
  }
  set allData(val){
    this.data = val;
  }

  set(name,value) {
    this.data[name] = value;
  }

  reset() {
    this.data = {};
  }

};