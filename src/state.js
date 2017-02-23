let { createStore, combineReducers } = require('redux');

//  let immutable = require('immutable');
//  stacks
//  register different types
//  initial state
const s = {
  services: [], // DOM, DOM Events, App Services, AJAX, PUBSUB << Interact with Redux? >> Rx Streams>>? Templating (plugin)>>
  modules: [],
  plugins: [],
  globalConfig: {}
};
// 
const ACTIONS = {
  SET_VAL: 'SET_VAL',
  REGISTER_ITEM: 'REGISTER_ITEM',
  REGISTER_MODULE: 'REGISTER_MODULE',
  GET_VAL: 'GET_VAL',
  GET_ALL: 'GET_ALL',
  IS_MODULE: 'IS_MODULE'
};

function registerItem(name, fn, itemType) {
  return {
    type: ACTIONS.REGISTER_ITEM,
    itemType,
    name,
    fn
  }
}

function setConfig(configType,value) {
  return {
    type: configType,
    value
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

function stack(state={services:[],modules:[],plugins:[]}, action) {
  console.log('stack', action);
  switch(action.itemType) {
    case ACTIONS.IS_MODULE:
      return Object.assign({}, state,{
        modules: [...(state.modules||[]),item(undefined, action)]
      });
    default:
      return state;
  }
}

function globalConfig(state={}, action) {
  switch(action.type) {
    case 'GLOBAL_CONFIG':
      return Object.assign({}, state, action.value);
    default:
      return state;
  }
}

// store
const reducers = combineReducers({stack, globalConfig});
const store = createStore(reducers);
//handler
function handleSubscribe() {
  console.log(store.getState());
}
let unsubscribe = store.subscribe(handleSubscribe);
// dispatch
store.dispatch(registerItem('name',function(){console.log('I am here')},'IS_MODULE'))
store.dispatch(registerItem('name',function(){console.log('I am here')}))
store.dispatch(setConfig('GLOBAL_CONFIG',{debug:true}));

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