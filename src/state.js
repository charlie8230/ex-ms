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
  REGISTER_ITEM: 'REGISTER_ITEM',
  GET_VAL: 'GET_VAL',
  GET_ALL: 'GET_ALL'
};

function registerItem(name, fn) {
  return {
    type: ACTIONS.REGISTER_ITEM,
    name,
    fn
  }
}

function item(state={},action){
  switch (action.type) {
    case ACTIONS.REGISTER_ITEM:
      return {
        name: action.name,
        fn: action.fn
      }
    default:
      return state;
  }
}
// reducer
function items(state=[], action) {
  switch(action.type) {
    case ACTIONS.REGISTER_ITEM:
      return [...state, item(undefined, action)]
    default:
      return state;
  }
}

// store
const reducers = combineReducers(items);
const store = createStore(reducers);
//unsub

// subscribe

// dispatch

//  API

let defaultState = {
  globalSettings: {
    debug: true
  } // immutable ?
}


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