// Context is a store with a bound elem?
// Context is passed on to the module factory functions
let {API, methods} = require('./events');

class Context extends API{
  constructor(elem) {
    super();
    this.el = this.elem = elem;
  }
}

module.exports = Context;
// needs init & life cycle
