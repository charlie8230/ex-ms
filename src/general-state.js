let {basic_curry} = require('./util');

let STATE = {config:{},stack:{}};

function reset() {
  return Object.assign(STATE.stack,{
      services:new Map(),
      serviceInit:new Set(),
      modules:new Map(),
      actions: new Map(),
      moduleRefs:new Map(),
      actionRefs: new Map(),
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
  function updateStack(type, name, fn, id) {
    let stack = STATE.stack;
    if (type == 'serviceInit') {
      stack[type].add(name);
    }
    else if (type=='moduleRefs') {
      stack[type].set(id, {type, name, fn});
    }
    else if (type=='actionRefs') {
      let refs = stack[type];
      if (refs.has(id)) {
        let ref = refs.get(id);
        ref.push({type, name, fn}); // multiple handlers with the same name should differentiate by the handler function 'fn'
      } else {
        let item = [{type, name, fn}];
        refs.set(id,item);
      }
    }
    else if (type in stack) {
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
      let {type, name, fn, id=0} = item;
      updateStack(type, name, fn, id);
    },
    get stack() {
      let stack = STATE.stack;
      return stack;
    }
  };
}

module.exports = state;
