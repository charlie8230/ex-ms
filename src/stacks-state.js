let { createStore, combineReducers } = require('redux');

function registerItem(name, fn, itemType) {
  return {
    type: 'REGISTER',
    itemType,
    name,
    fn
  }
}

function item(state={},action){
  switch (action.type) {
    case 'REGISTER':
      return {
        name: action.name,
        fn: action.fn,
        itemType: action.itemType
      }
    default:
      return state;
  }
}

function stack(state={services:[],modules:[],plugins:[]}, action) {
  let {itemType} = action;
  if(itemType) {
      let itemObj = {};
      itemObj[itemType] = [...(state[itemType]||[]),item(undefined, action)];
      return Object.assign({}, state, itemObj);
  } else {
      return state;
  }
}

// store
const reducers = combineReducers({stack});
const store = createStore(reducers);
//handler
function dispatch({name, fn, type}) {
  // dispatch
  store.dispatch(registerItem(name,fn,type));

}

module.exports = {
  unsubscribe: {},
  handleSubscribe(handler){
    this.unsubscribe = store.subscribe(handler);
  },
  set stack(item) {
    dispatch(item||{});
  },
  get stack() {
    let {stack} = store.getState()||{}; 
    return stack;
  }
};