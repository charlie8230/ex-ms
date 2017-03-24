import mitt from 'mitt'

let emitter = mitt();
let emitterAPI = Object.assign({
  //  Adapter for T3 users
  onmessage(fn, msgs=[]){
    let handler, handlers = [];
    if (typeof fn ==='function') {
      handler = (function(fn, msgs){
        return function (type, data) {
          let index = msgs.indexOf(type);
          if(index!==-1) {
            fn(type, data);
          } else {
            fn(type, data)
          }
        }
      })(fn, msgs);
      debugger;
      this.on('*',handler);
    } else {
      if(typeof fn ==='object') {
        for (var _handler in fn) {
          debugger;
          this.on(_handler, fn[_handler]);
        }
      }
    }
  }
},emitter);

class API {
  on(msg, handler) {
    emitter.on(msg, handler);
  }
  off(msg, handler) {
    emitter.off(msg, handler);
  }
  emit(msg, data) {
    emitter.emit(msg, data);
  }
  trigger(...args) {
    this.emit(args);
  }
}

module.exports = {API,emitterAPI};