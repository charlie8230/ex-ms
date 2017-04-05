let mitt = require('mitt');
let {basic_curry} = require('./util');

let emitter = mitt();
let emitterAPI = Object.assign({
  //  Adapter for T3 users
  onmessage(fn, msgs=[]){
    if (typeof fn ==='function' && msgs.length>0) {
      let handler = basic_curry(fn);
      msgs.forEach(e=>{
        let fx = handler(e);
        this.on(e, fx);
      });
    } else {
      if(typeof fn ==='object') {
        for (var _handler in fn) {
          this.on(_handler, fn[_handler]);
        }
      }
    }
  },
  broadcast(...args){
    this.emit(...args);
  },
  on(msg, handler) {
    emitter.on(msg, handler);
  },
  off(msg, handler) {
    emitter.off(msg, handler);
  }
},emitter);


module.exports = {emitterAPI, emitter};