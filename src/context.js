// Context is a store with a bound elem?
// Context is passed on to the module factory functions
let {API, methods} = require('./events');
let {logger, debugMode}  = require('./logger');

class Context extends API{
  constructor(elem, App) {
    super();
    this.el = this.elem = elem;
    this.status = 'created';
    this.getService = App.getService.bind(App);
    this.getSubModule = App.asSubModule.bind(App);
  }
  destroy() {
    this.el = null;
    this.status = null;
  }
}

module.exports = Context;
// needs init & life cycle
