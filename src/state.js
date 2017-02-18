let { createStore, combineReducers } = require('redux');

let immutable = require('immutable');

let stacks = {
  'plugins': [],
  'services': [],
  'actions': []
};

// initial state
// actions
// reducer
// store
// subscribe
// dispatch

//  API


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