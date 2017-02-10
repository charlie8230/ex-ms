/**
 * @fileoverview Main library
 * @author Carlos Moran
 */

const app = require('./app');

let previousEXMS;

const __EXMS = Object.assign(app,{
  noConflict() {
    window.EXMS = previousEXMS;
    return this;
  }
});

if (window['EXMS']) previousEXMS = window['EXMS'];

module.exports = __EXMS;
