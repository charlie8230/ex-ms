
let {basic_curry} = require('./util');

function _resetState(){
  return Object.assign({},{
    services:[],
    serviceInit:[],
    modules:[],
    actions: [],
    moduleRefs:[],
    plugins:[]
  });
};

let STATE = _resetState();

function _getState(){
  return STATE;
}

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

function stack(state, action) {
  let {itemType, type, name} = action;
  let itemObj = {};
  if(itemType) {
    switch (type) {
      case 'REMOVE_FROM_SVC_STACK':
        itemObj['serviceInit'] = (state['serviceInit']||[]).filter(val=>val.name!==name);
        return Object.assign({}, state, itemObj);
      case 'ADD_API':
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

//handler
function dispatch({name, fn, type, api}) {
  // dispatch
 let action = registerItem(name,fn,type, api);
 // new state
 STATE = stack(STATE, action);

}

let stackState = {
  set stack(item) {
    dispatch(item||{});
  },
  get stack() {
    let stack = _getState()||{}; 
    return stack;
  }
};

/* General functions */
function updateStack(type, name, fn) {
  stackState.stack = {type, name, fn};
}

function addToStack(type){
  return basic_curry(updateStack)(type);
}

module.exports = { stackState, stackFunctions: {updateStack, addToStack}};