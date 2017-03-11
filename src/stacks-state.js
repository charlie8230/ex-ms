let { createStore, combineReducers } = require('redux');
let R = require('../vendor/ramda/dist/ramda.custom');

function registerItem(name, fn, itemType, api) {
  let type = 'REGISTER';
  switch(itemType) {
    case 'serviceInitDone':
      console.log('Removing Service', name);
      type = 'REMOVE_FROM_SVC_STACK';
      itemType = 'serviceInit';
      break;
    case 'serviceInitAdd':
      console.log('adding service', name);
      type = 'REGISTER';
      itemType = 'serviceInit';
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

function stack(state={services:[],serviceInit:[], modules:[],moduleRefs:[],plugins:[]}, action) {
  let {itemType, type, name} = action;
  let itemObj = {};
  if(itemType) {
    switch (type) {
      case 'REMOVE_FROM_SVC_STACK':
        itemObj['serviceInit'] = (state['serviceInit']||[]).filter(val=>val.name!==name);
        return Object.assign({}, state, itemObj);
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

let stackState = {
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

/* General functions */
function updateStack(type, name, fn) {
  stackState.stack = {type, name, fn};
}

function addToStack(){
  return R.curry(updateStack);
}

module.exports = { stackState, stackFunctions: {updateStack, addToStack}};