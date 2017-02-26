let { createStore, combineReducers } = require('redux');

const SET_VAL = 'SET_VAL';

function config(state={}, action) {
  switch(action.type) {
    case 'SET_VAL':
      return Object.assign({}, state, action.value);
    default:
      return state;
  }
}

// store
const reducers = combineReducers({config});

function state(init={}, handler) {
  let self = this;
  this.store = createStore(reducers);
  
  set(init);
  if (handler) {
    setHandler(handler);
  }

  function set(value){
    self.store.dispatch({type:'SET_VAL', value});
  }
  function get(prop=undefined) {
    let state = self.store.getState();
    if (prop) {
      return state[prop];
    } else {
      return state;
    }
  }
  //  bind a listener to the Redux store
  function setHandler(handler) {
    return this.unsubscribe = self.store.subscribe(handler);
  }
  function destroy() {
    if (self.unsubscribe) self.unsubscribe();
  }
  return { 
    get, 
    set, 
    setHandler,
    get config(){
      return this.get('config');
    }
  };
  
}


module.exports = state;
