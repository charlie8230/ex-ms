let {basic_curry} = require('./util');

let STATE = {config:{},stack:{}};

function reset() {
  return Object.assign(STATE.stack,{
      services:new Map(),
      serviceInit:new Map(),
      modules:new Map(),
      actions: new Map(),
      moduleRefs:new Map(),
      plugins:new Map()
  });
}

reset();

function updateConfig(item=null){
  if (item) return Object.assign(STATE.config,item);
}

function getState(prop=null) {
  return STATE[prop] || {};
}

function state(init={}) {

  function set(item){
    updateConfig(item);
  }

  /* General functions */
  function updateStack(type, name, fn) {
    let stack = STATE.stack;
    if (type in stack) {
      stack[type].set(name, {type, name, fn});
    }
  }

  function addToStack(type){
    return basic_curry(updateStack)(type);
  }

  function removeStackItem(type, name) {
    let stack = STATE.stack;
    if (type in stack) {
      stack[type].delete(name);
    }
  }

  function clearStack(type) {
    STATE.stack && STATE.stack[type] && STATE.stack[type].clear();
  }

  set(init);

  return { 
    set,
    reset,
    addToStack,
    removeStackItem,
    clearStack,
    set config(item){
      this.set(item);
    },
    get config(){
      return getState('config');
    },
    set stack(item) {
      let {type, name, fn} = item;
      updateStack(type, name, fn);
    },
    get stack() {
      let stack = STATE.stack;
      return stack;
    }
  };
}

module.exports = state;
