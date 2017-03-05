let {getQueryVariable} = require('./util');
const debugMode = getQueryVariable('debug') || getQueryVariable('debugger');
const logger = debugMode ?console:function(){};
const log = debugMode ? console.log: function(){};
module.exports = {logger, log, debugMode};
