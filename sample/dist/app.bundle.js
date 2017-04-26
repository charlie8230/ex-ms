/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

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

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./anewmodule.js": 1,
	"./anothermodule.js": 2,
	"./module3.js": 3
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 0;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function factory(context) {
  return {
    init: function init() {}
  };
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function factory(context) {
  console.log(context);
  return {
    init: function init() {
      debugger;
    }
  };
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function add(context) {
  console.log('this is module 3', context._id);
  return {
    a: context._id
  };
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*  

*/
console.log(typeof EXMS === 'undefined' ? 'undefined' : _typeof(EXMS));
var log = EXMS.logger.log;
EXMS.addModule('hi', function (ctx) {
  console.log('module');
  ctx.on('event2', function (data) {
    console.log('Inside Hiiii', data);
  });
  log('returning from hi');
  return {
    init: function init() {
      log('init!');
      log(ctx.el.id);
    },

    onmessage: {
      helloMSG: function helloMSG() {
        log('another pattern');
        ctx.broadcast('anotherPatter', { data: 'another' });
      }
    }
  };
});
EXMS.addModule('msg', function (ctx) {
  log('testing msg on return');
  return {
    init: function init() {
      log('init!');
      log(ctx.el.id);
    },

    actions: ['menu', 'menu2'],
    messages: ['helloMSG', 'anotherPattern'],
    onmessage: function onmessage(name, data) {
      log(name, data);
    }
  };
});
EXMS.addBehavior('menu', function (context) {
  log('I am a behavior');
});
EXMS.addBehavior('menu2', function (context) {
  log('I am a behavior2 attached to', context.getElement().id);
  return {
    onclick: function onclick(e) {
      console.log(e, 'was clicked');
    }
  };
});
EXMS.addModule('list', function (ctx) {
  var msg = 'HI!!';
  window.ctx = ctx;
  var t = ctx.getService('time');
  console.log(t);
  console.log('module', ctx);
  var cfg = ctx.getConfig();
  ctx.on('event', function (data) {
    console.log('Inside CTX', msg, data, cfg);
  });
  return {
    onclick: function onclick(event) {
      console.log(event);
    }
  };
});
EXMS.addService('date', function (App) {
  return new Date();
});
EXMS.addService('time', function (App) {
  var dt = App.getService('date');console.log(dt);return Date.now();
});
EXMS.addService('datetime', function (App) {
  var dt = App.getService('date'); /*let t = App.getService('all')*/
});
EXMS.addService('all', function (App) {
  var dt = App.getService('time');var t = App.getService('alltime');
});
EXMS.addService('alltime', function (App) {
  var dt = App.getService('time');var t = App.getService('datetime');
});
EXMS.cache = [];
function importModules(r) {
  r.keys().forEach(function (key) {
    return EXMS.cache.push({ name: key, fn: r(key), type: 'modules' });
  });
}

importModules(__webpack_require__(0));

EXMS.startModules();

/***/ })
/******/ ]);