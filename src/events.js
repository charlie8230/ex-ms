import mitt from 'mitt'

let emitter = mitt();
let emitterAPI = Object.assign({},emitter);
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