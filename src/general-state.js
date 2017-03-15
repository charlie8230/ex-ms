
let STATE = {};

function updateState(item){
  if (item) return Object.assign({},STATE,item);
  return {};
}

function setState(item) {
  STATE = updateState(item);
}

function getState() {
  return STATE;
}

function state(init={}) {

  function set(item){
   setState(item);
  }

  function get(prop=undefined) {
    let state = getState();
    if (prop) {
      return state[prop];
    } else {
      return state;
    }
  }

  set(init);

  return { 
    get, 
    set,
    set config(item){
      setState(item);
    },
    get config(){
      return getState();
    }
  };
  
}

module.exports = state;
