let {getQueryVariable} = require('./util');
const debugMode = getQueryVariable('debug') || getQueryVariable('debugger');
const _noopConsole = {log(){},error(){},warn(){}};
const logger = debugMode ?console:_noopConsole;
const log = logger.log = debugMode ? console.log: _noopConsole.log;
module.exports = {logger, log, debugMode};
