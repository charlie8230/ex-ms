let {getQueryVariable} = require('./util');
const debugMode = getQueryVariable('debug') || getQueryVariable('debugger');
const logger = console && debugMode ?console:function(){};
module.exports = {logger, debugMode};
