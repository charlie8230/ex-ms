(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["EXMS"] = factory();
	else
		root["EXMS"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomFromSeed = __webpack_require__(13);

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function (item, ind, arr) {
        return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

module.exports = {
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var shortid = __webpack_require__(7);
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}
/*      Actually partial application of one parameter... may be extended to multiple params */
function basic_curry(fn) {
  return function (first) {
    return fn.bind(this, first);
  };
}
module.exports = { shortid: shortid, getQueryVariable: getQueryVariable, basic_curry: basic_curry };

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomByte = __webpack_require__(12);

function encode(lookup, number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + lookup(number >> 4 * loopCounter & 0x0f | randomByte());
        done = number < Math.pow(16, loopCounter + 1);
        loopCounter++;
    }
    return str;
}

module.exports = encode;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var mitt = __webpack_require__(6).default;

var _require = __webpack_require__(1),
    basic_curry = _require.basic_curry;

var emitter = mitt();
var emitterAPI = Object.assign({
  //  Adapter for T3 users
  onmessage: function onmessage(fn) {
    var _this = this;

    var msgs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (typeof fn === 'function' && msgs.length > 0) {
      var handler = basic_curry(fn);
      msgs.forEach(function (e) {
        var fx = handler(e);
        _this.on(e, fx);
      });
    } else {
      if ((typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) === 'object') {
        for (var _handler in fn) {
          this.on(_handler, fn[_handler]);
        }
      }
    }
  },
  broadcast: function broadcast() {
    this.emit.apply(this, arguments);
  },
  on: function on(msg, handler) {
    emitter.on(msg, handler);
  },
  off: function off(msg, handler) {
    emitter.off(msg, handler);
  }
}, emitter);

module.exports = { emitterAPI: emitterAPI, emitter: emitter };

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    getQueryVariable = _require.getQueryVariable;

var debugMode = getQueryVariable('debug') || getQueryVariable('debugger');
var _noopConsole = {
  log: function log() {},
  error: function error() {},
  warn: function warn() {}
};
var logger = debugMode ? console : _noopConsole;
var log = logger.log = debugMode ? console.log : _noopConsole.log;
module.exports = { logger: logger, log: log, debugMode: debugMode };

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var util = __webpack_require__(1);
var generalState = __webpack_require__(17);
var globalConfig = new generalState({ debugger: debugMode, initCompleted: false, adaptHandlers: false, moduleSelector: '[data-module]', maxServiceDepth: 8 });
var Context = __webpack_require__(15);

var _require = __webpack_require__(3),
    API = _require.API,
    emitterAPI = _require.emitterAPI;

var _require2 = __webpack_require__(4),
    logger = _require2.logger,
    log = _require2.log,
    debugMode = _require2.debugMode;

var app = {
  globalConfig: globalConfig,
  get stacks() {
    return this.globalConfig.stack || {};
  },
  set stacks(item) {
    this.globalConfig.stack = item;
  },
  get config() {
    return this.globalConfig.config;
  },
  set config(val) {
    this.globalConfig.set(val);
  },
  init: function init(config) {
    this.globalConfig.set(config);
  },

  logger: logger,
  getElements: function getElements() {
    return document.querySelectorAll(this.config.moduleSelector);
  },
  addModule: function addModule(name, fn) {
    globalConfig.addToStack('modules')(name, fn);
  },
  addService: function addService(name, fn) {
    globalConfig.addToStack('services')(name, fn);
  },
  addAction: function addAction(name, fn) {
    globalConfig.addToStack('actions')(name, fn);
  },
  addBehavior: function addBehavior(name, fn) {
    // T3 Adapter
    globalConfig.addToStack('actions')(name, fn);
  },
  getModuleName: function getModuleName() {
    var elem = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var key = selector.replace(/[\[\]]/g, '');
    if (elem) {
      return elem && elem.attributes && elem.attributes[key] && elem.attributes[key].value;
    } else {
      return elem;
    }
  },
  getModule: function getModule() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var stack = this.stacks['modules'];
    return stack && stack.get(name);
  },
  startAll: function startAll() {
    var _this = this;

    var stacks = this.stacks;
    var mRefs = stacks['moduleRefs'];
    mRefs.forEach(function (moduleInit) {
      if (moduleInit['fn'] && moduleInit.fn['init']) {
        _this.runFunction(moduleInit.fn, 'init', 'Error running Init on ' + moduleInit.name, false);
      }
    });
  },
  getService: function getService() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var stack = this.stacks['services'];
    var svcFn = stack && stack.get(name);
    var svc = void 0;
    if (svcFn) {
      if ('api' in svcFn) {
        //  log('Got ', svcFn['name'], ' already'); // Singleton cannot be inited again
        return svcFn['api'];
      }
      // bails out on circular ref checks
      var svcName = svcFn['name'];
      var servicesInProgress = this.stacks['serviceInit'];
      if (servicesInProgress.size > globalConfig.maxServiceDepth) {
        return; // Too deep - bail out
      }
      var circular = servicesInProgress.has(svcName);
      if (circular) {
        return;
      }
      this.stacks = { type: 'serviceInit', name: svcName };
      svc = this.runFunction(svcFn, 'fn', 'Error starting service: ' + svcFn.name, this);
      svcFn['api'] = svc; // ok
      this.globalConfig.removeStackItem('serviceInit', svcName);

      return svc;
    }
  },
  getGlobal: function getGlobal(name) {
    return typeof window[name] === 'undefined' ? null : window[name];
  },
  getAction: function getAction() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var stack = this.stacks['actions'];
    return stack && stack.get(name);
  },
  runStart: function runStart() {
    if (this.config['initCompleted']) {
      return true;
    }
    this.setupModules();
    this.startAll();
  },
  startModules: function startModules(kickoffmsg) {
    var _this2 = this;

    if (kickoffmsg) {
      this.on(kickoffmsg, function () {
        _this2.runStart();
      });
    } else {
      this.runStart();
    }
  },
  stop: function stop(elem) {
    var _this3 = this;

    var id = elem.dataset['_id'] && elem.dataset['_id'] || String(elem.id).replace(/module-/, '');
    if (typeof id !== 'undefined' || id !== '') {
      var refs = this.stacks['moduleRefs'];
      var actionRefs = this.stacks['actionRefs'];
      if (actionRefs.has(id)) {
        var actions = actionRefs.get(id);
        actions.forEach(function (val) {
          _this3.detachHandler(elem, val.name, val.fn);
        });
        this.globalConfig.removeStackItem('actionRefs', id);
      }
      if (refs.has(id)) {
        var moduleRef = refs.get(id);
        if (moduleRef['destroy']) {
          moduleRef.destroy();
        }
        this.globalConfig.removeStackItem('moduleRefs', id); // remove event handlers???
      } else {
          return; // no need to remove from refs
        }
    }
  },
  reset: function reset() {
    this.globalConfig.reset();
  },
  cleanUpName: function cleanUpName(item) {
    // Clean up an ES module name as provided by webpack into our cache
    if (item['name']) {
      var name = String(item['name']);
      var shortName = name.replace(/^.*[\\\/]/, '');
      var noExt = shortName.substr(0, shortName.lastIndexOf('.')) || shortName;
      item['name'] = '' + noExt;
    }
    return item;
  },
  processCache: function processCache() {
    var _this4 = this;

    if (this.cache && this.cache.length > 0) {
      var cache = this.cache;
      cache.map(this.cleanUpName).forEach(function (e) {
        _this4.stacks = e;
      });
      this.cache = null; // clear all references
    }
  },

  _EVENT_TYPES: ['click', 'mouseover', 'mouseout', 'mousedown', 'mouseup', 'mouseenter', 'mouseleave', 'mousemove', 'keydown', 'keyup', 'submit', 'change', 'contextmenu', 'dblclick', 'input', 'focusin', 'focusout'],
  attachHandler: function attachHandler(elem, name, handler) {
    if (elem instanceof Node) {
      elem.dataset.hasEvents = true;
      elem.addEventListener(name, handler);
    }
  },
  detachHandler: function detachHandler(elem, name, handler) {
    if (elem instanceof Node) {
      elem.dataset.hasEvents = false;
      elem.removeEventListener(name, handler);
    }
  },
  collectEvents: function collectEvents(processType, process, elem) {
    var _this5 = this;

    // process = module || behavior
    var keys = Object.keys(process);
    var handlers = keys.filter(function (val) {
      return _this5._EVENT_TYPES.lastIndexOf(val.replace(/^on/, '')) >= 0;
    }).filter(function (val) {
      return (/on/.test(val)
      );
    });
    var adapt = this.config.adaptHandlers;
    handlers.forEach(function (value) {
      var _handler = process[value];
      var _finalHandler = _handler;
      var _name = value.replace(/^on/, '');
      var _track_name = processType + _name;
      if (adapt) {
        _finalHandler = _this5.adaptHandler(_handler);
      }
      _this5.attachHandler(elem, _name, _finalHandler);
      _this5.stacks = { type: 'actionRefs', fn: _finalHandler, name: _name, id: elem.dataset._id };
    });
  },
  adaptHandler: function adaptHandler(handler) {
    return function (event) {
      var element = event.currentTarget;
      var elementType = element && element.dataset && element.dataset.type;
      return handler(event, element, elementType);
    };
  },
  runFunction: function runFunction(API) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'fn';
    var errorMsg = arguments[2];

    var result = void 0;
    if (name in API) {
      try {
        for (var _len = arguments.length, params = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
          params[_key - 3] = arguments[_key];
        }

        result = API[name].apply(API, _toConsumableArray(params));
      } catch (e) {
        logger.error(errorMsg, '\n', e);
      }
    }
    return result;
  },
  setupModules: function setupModules() {
    var _this6 = this;

    this.processCache(); // register modules, behaviors & services that were imported as common JS

    var elems = this.getElements();
    elems.forEach(function (e) {
      var name = _this6.getModuleName(e, _this6.config.moduleSelector);
      if (!name) return;
      var exmodule = _this6.getModule(name);

      var context = new Context(e, _this6, util);
      if (exmodule && exmodule['fn']) {
        var moduleFn = void 0;
        moduleFn = _this6.runFunction(exmodule, 'fn', 'Error starting module ' + name, context);

        if (moduleFn) {
          if (moduleFn['onmessage']) {
            emitterAPI.onmessage(moduleFn['onmessage'], moduleFn['messages']);
          }
          _this6.collectEvents('module', moduleFn, context.el);

          var actions = moduleFn['actions'] || moduleFn['behaviors'] || [];

          if (actions && actions.length > 0) {
            actions.forEach(function (name) {
              var act = _this6.getAction(name);
              if (act && act['fn']) {
                var process = _this6.runFunction(act, 'fn', 'Error starting behavior ' + name, context);
                if (process) {
                  var processInit = process['init'];
                  _this6.collectEvents('behavior', process, context.el);
                  if (processInit) {
                    _this6.runFunction(process, 'init', 'Error starting behavior ' + name + ' init', context);
                  }
                }
              }
            });
          }
          _this6.stacks = { type: 'moduleRefs', name: name, fn: moduleFn, id: context._id };
        }
      }
    });
    this.config = { initCompleted: true };
  }
};
//  Extend
Object.assign(app, emitterAPI);

module.exports = app;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
//      
// An event handler can take an optional event argument
// and should not return a value

// An array of all currently registered event handlers for a type

// A map of event types and their corresponding event handlers.


/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */
function mitt(all) {
	all = all || Object.create(null);

	return {
		/**
   * Register an event handler for the given type.
   *
   * @param  {String} type	Type of event to listen for, or `"*"` for all events
   * @param  {Function} handler Function to call in response to given event
   * @memberOf mitt
   */
		on: function on(type, handler) {
			(all[type] || (all[type] = [])).push(handler);
		},

		/**
   * Remove an event handler for the given type.
   *
   * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
   * @param  {Function} handler Handler function to remove
   * @memberOf mitt
   */
		off: function off(type, handler) {
			if (all[type]) {
				all[type].splice(all[type].indexOf(handler) >>> 0, 1);
			}
		},

		/**
   * Invoke all handlers for the given type.
   * If present, `"*"` handlers are invoked after type-matched handlers.
   *
   * @param {String} type  The event type to invoke
   * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
   * @memberof mitt
   */
		emit: function emit(type, evt) {
			(all[type] || []).map(function (handler) {
				handler(evt);
			});
			(all['*'] || []).map(function (handler) {
				handler(type, evt);
			});
		}
	};
}

exports.default = mitt;
//# sourceMappingURL=mitt.es.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(10);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var encode = __webpack_require__(2);
var alphabet = __webpack_require__(0);

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {

    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + encode(alphabet.lookup, version);
    str = str + encode(alphabet.lookup, clusterWorkerId);
    if (counter > 0) {
        str = str + encode(alphabet.lookup, counter);
    }
    str = str + encode(alphabet.lookup, seconds);

    return str;
}

module.exports = build;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(0);

/**
 * Decode the id to get the version and worker
 * Mainly for debugging and testing.
 * @param id - the shortid-generated id.
 */
function decode(id) {
    var characters = alphabet.shuffled();
    return {
        version: characters.indexOf(id.substr(0, 1)) & 0x0f,
        worker: characters.indexOf(id.substr(1, 1)) & 0x0f
    };
}

module.exports = decode;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(0);
var encode = __webpack_require__(2);
var decode = __webpack_require__(9);
var build = __webpack_require__(8);
var isValid = __webpack_require__(11);

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = __webpack_require__(14) || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
  alphabet.seed(seedValue);
  return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
  clusterWorkerId = workerId;
  return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
  if (newCharacters !== undefined) {
    alphabet.characters(newCharacters);
  }

  return alphabet.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.decode = decode;
module.exports.isValid = isValid;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(0);

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6) {
        return false;
    }

    var characters = alphabet.characters();
    var len = id.length;
    for (var i = 0; i < len; i++) {
        if (characters.indexOf(id[i]) === -1) {
            return false;
        }
    }
    return true;
}

module.exports = isShortId;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var crypto = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

function randomByte() {
    if (!crypto || !crypto.getRandomValues) {
        return Math.floor(Math.random() * 256) & 0x30;
    }
    var dest = new Uint8Array(1);
    crypto.getRandomValues(dest);
    return dest[0] & 0x30;
}

module.exports = randomByte;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280.0;
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = 0;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Context is passed on to the module factory functions
var _require = __webpack_require__(3),
    emitterAPI = _require.emitterAPI;

var _require2 = __webpack_require__(4),
    logger = _require2.logger,
    debugMode = _require2.debugMode;

function Context(elem, App, util) {
  var id = elem.id || '',
      shortid = util.shortid.generate(),
      _id = id || shortid;
  this.el = this.elem = elem;
  this._id = _id;
  this.el.id = 'module-' + this._id;
  this.el.dataset._id = _id;
  this.status = 'created';
  /*  Needs to be abstracted out of App */
  this.getService = App.getService.bind(App);
  //  this.getSubModule = App.asSubModule.bind(App);
  this.getGlobal = App.getGlobal.bind(App);
}

Context.prototype = Object.assign(Context.prototype, emitterAPI, {
  getElement: function getElement() {
    return this.el;
  },
  getConfig: function getConfig() {
    var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var children = this.el.children;
    var config = null;
    try {
      [].forEach.call(children, function (elem) {
        if (!config && elem.type == "text/x-config") {
          config = JSON.parse(elem.innerHTML);
        }
      });
    } catch (e) {
      logger.log('Could not Parse config');
    }
    if (item && config) {
      if (item in config) {
        return config[item];
      }
      return false;
    }

    return config || {};
  },
  destroy: function destroy() {
    this.el = null;
    this.status = null;
  }
});

module.exports = Context;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @fileoverview Main library
 * @author Carlos Moran
 */

var app = __webpack_require__(5);

var previousEXMS = void 0;

var __EXMS = Object.assign(app, {
  noConflict: function noConflict() {
    window.EXMS = previousEXMS;
    return this;
  }
});

if (window['EXMS']) previousEXMS = window['EXMS'];

module.exports = __EXMS;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    basic_curry = _require.basic_curry;

var STATE = { config: {}, stack: {} };

function reset() {
  return Object.assign(STATE.stack, {
    services: new Map(),
    serviceInit: new Set(),
    modules: new Map(),
    actions: new Map(),
    moduleRefs: new Map(),
    actionRefs: new Map(),
    plugins: new Map()
  });
}

reset();

function updateConfig() {
  var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  if (item) return Object.assign(STATE.config, item);
}

function getState() {
  var prop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  return STATE[prop] || {};
}

function state() {
  var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


  function set(item) {
    updateConfig(item);
  }

  /* General functions */
  function updateStack(type, name, fn, id) {
    var stack = STATE.stack;
    if (type == 'serviceInit') {
      stack[type].add(name);
    } else if (type == 'moduleRefs') {
      stack[type].set(id, { type: type, name: name, fn: fn });
    } else if (type == 'actionRefs') {
      var refs = stack[type];
      if (refs.has(id)) {
        var ref = refs.get(id);
        ref.push({ type: type, name: name, fn: fn }); // multiple handlers with the same name should differentiate by the handler function 'fn'
      } else {
        var item = [{ type: type, name: name, fn: fn }];
        refs.set(id, item);
      }
    } else if (type in stack) {
      stack[type].set(name, { type: type, name: name, fn: fn });
    }
  }

  function addToStack(type) {
    return basic_curry(updateStack)(type);
  }

  function removeStackItem(type, name) {
    var stack = STATE.stack;
    if (type in stack) {
      stack[type].delete(name);
    }
  }

  function clearStack(type) {
    STATE.stack && STATE.stack[type] && STATE.stack[type].clear();
  }

  set(init);

  return {
    set: set,
    reset: reset,
    addToStack: addToStack,
    removeStackItem: removeStackItem,
    clearStack: clearStack,
    set config(item) {
      this.set(item);
    },
    get config() {
      return getState('config');
    },
    set stack(item) {
      var type = item.type,
          name = item.name,
          fn = item.fn,
          _item$id = item.id,
          id = _item$id === undefined ? 0 : _item$id;

      updateStack(type, name, fn, id);
    },
    get stack() {
      var stack = STATE.stack;
      return stack;
    }
  };
}

module.exports = state;

/***/ })
/******/ ]);
});