// Context is a store with a bound elem?
// Context is passed on to the module factory functions
let {API, methods} = require('./events');
let {logger, debugMode}  = require('./logger');

class Context extends API{
  constructor(elem, App, util) {
    let id = elem.id || '',
        shortid = util.shortid.generate(),
        _id = id || shortid;
    super();
    this.el = this.elem = elem;
    this._id = _id;
    this.el.id = `module-${this._id}`;
    this.status = 'created';
    this.getService = App.getService.bind(App);
    this.getSubModule = App.asSubModule.bind(App);
    this.getGlobal = App.getGlobal.bind(App);
  }
  getElement(){
    return this.el;
  }
  destroy() {
    this.el = null;
    this.status = null;
  }
}

module.exports = Context;
