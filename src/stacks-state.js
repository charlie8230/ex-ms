let { createStore, combineReducers } = require('redux');

function registerItem(name, fn, itemType, api) {
  let type = 'REGISTER';
  switch(itemType) {
    case 'serviceInitDone':
      type = 'REMOVE_FROM_SVC_STACK';
      break;
    case 'serviceInitAdd':
      type = 'ADD_TO_SERVICE_STACK';
      break;
    case 'services':
      type = typeof api ==='undefined' ? 'REGISTER':'ADD_API';
      break;
    default:
     break;
  }
  return {
    type,
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
    case 'ADD_API':
      return Object.assign({},state,{api: action.api});
    default:
      return state;
  }
}

function stack(state={services:[],serviceInit:[], modules:[],plugins:[]}, action) {
  let {itemType, type, name} = action;
  let itemObj = {};
  if(itemType) {
    switch (type) {
      case 'ADD_API':
        debugger;
        console.log('running map');
        // specific stack
        itemObj[itemType] = [(state[itemType]||[]).map((val)=>{
          if (val.name===name) {
            return item(val,action);
          } else {
            return val;
          }
        })];
        return Object.assign({}, state, itemObj);
      case 'REGISTER':

        // specific stack
        itemObj[itemType] = [...(state[itemType]||[]),item(undefined, action)];
        return Object.assign({}, state, itemObj);
      default:
        return state;
    }
  } else {
      return state;
  }
}

// store
const reducers = combineReducers({stack});
const store = createStore(reducers);
//handler
function dispatch({name, fn, type, api}) {
  // dispatch
  store.dispatch(registerItem(name,fn,type, api));

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