let mitt = require('mitt');
let R = require('../vendor/ramda/dist/ramda.custom');

let emitter = mitt();
let emitterAPI = Object.assign({
  //  Adapter for T3 users
  onmessage(fn, msgs=[]){
    if (typeof fn ==='function' && msgs.length>0) {
      let handler = R.curry(fn);
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
  }
},emitter);

class API {
  constructor(){
    this.broadcast = this.trigger = this.emit = emitter.emit;
  }
  on(msg, handler) {
    emitter.on(msg, handler);
  }
  off(msg, handler) {
    emitter.off(msg, handler);
  }
}

module.exports = {API,emitterAPI};