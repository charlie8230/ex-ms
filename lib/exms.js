/**
 * @fileoverview Base namespaces for T3 JavaScript.
 * @author Box
 * @author Carlos Moran
 */

/**
 * Global object for T3 JavaScript.
 * @namespace
*/
const app = require('./application');

let previousT3;

const __t3 = Object.assign(app,{
  noConflict() {
    window.T3 = previousT3;
    return this;
  }
});

if (window['T3']) previousT3 = window['T3'];

module.exports = __t3;
