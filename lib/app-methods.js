const DOM = require('./dom-native');
const Context = require('./context');
let globalConfig = {},
    initialized = false;

/**
 * Returns the requested service
 * @param {string} serviceName The name of the service to retrieve.
 * @returns {Object} An object if the service
 * @throws {Error} If service does not exist or there is a circular dependency
 * @private
 */
function getService(serviceName) {

  var serviceData = services[serviceName];

  if (serviceData) {

    if (!serviceData.instance) {
      // check for circular dependencies
      if (isServiceBeingInstantiated(serviceName)) {
        error(new ReferenceError('Circular service dependency: ' + serviceStack.join(' -> ') + ' -> ' + serviceName));
        return null;
      }

      // flag that this service is being initialized just in case there's a circular dependency issue
      serviceStack.push(serviceName);

      serviceData.instance = serviceData.creator(application);

      // no error was thrown for circular dependencies, so we're done
      serviceStack.pop();
    }

    return serviceData.instance;
  } else {
    error(new Error('Service "' + serviceName + '" not found'));
  }

  return null;
}

/**
 * Signals that an error has occurred. If in development mode, an error
 * is thrown. If in production mode, an event is fired.
 * @param {Error} [exception] The exception object to use.
 * @returns {void}
 * @private
 */
function error(exception) {
  if (typeof customErrorHandler === 'function') {
    customErrorHandler(exception);
    return;
  }
  if (globalConfig.debug) {
    throw exception;
  } else {
    application.fire('error', {
      exception: exception
    });
  }
}

const appMethods = {

		//----------------------------------------------------------------------
		// Application Lifecycle
		//----------------------------------------------------------------------

		/**
		 * Initializes the application
		 * @param {Object} [params] Configuration object
		 * @returns {Box.Application} The application object.
		 */
		init(params) {
			Object.assign(globalConfig, params || {});

			this.startAll(document.documentElement);

			this.fire('init');
			initialized = true;
			return this;
		},

		/**
		 * Stops all modules and clears all saved state
		 * @returns {Box.Application} The application object.
		 */
		destroy() {
			this.stopAll(document.documentElement);

			reset();

			return this;
		},

		//----------------------------------------------------------------------
		// Module Lifecycle
		//----------------------------------------------------------------------

		/**
		 * Determines if a module represented by the HTML element is started.
		 * If the element doesn't have a data-module attribute, this method
		 * always returns false.
		 * @param {HTMLElement} element The element that represents a module.
		 * @returns {boolean} True if the module is started, false if not.
		 */
		isStarted(element) {
			var instanceData = getInstanceDataByElement(element);
			return typeof instanceData === 'object';
		},

		/**
		 * Begins the lifecycle of a module (registers and binds listeners)
		 * @param {HTMLElement} element DOM element associated with module to be started
		 * @returns {Box.Application} The application object.
		 * @throws {Error} If a module being started is not defined
		 */
		start(element) {
			var moduleName = getModuleName(element),
				moduleData = modules[moduleName],
				instanceData,
				context,
				module;

			if (!moduleData) {
				error(new Error('Module type "' + moduleName + '" is not defined.'));
				return this;
			}

			if (!this.isStarted(element)) {
				// Auto-assign module id to element
				if (!element.id) {
					element.id = 'mod-' + moduleName + '-' + moduleData.counter;
				}

				moduleData.counter++;

				context = new Box.Context(this, element);

				module = moduleData.creator(context);

				// Prevent errors from showing the browser, fire event instead
				if (!globalConfig.debug) {
					captureObjectErrors(module, moduleName);
				}

				instanceData = {
					moduleName: moduleName,
					instance: module,
					context: context,
					element: element,
					eventDelegates: []
				};

				instances[element.id] = instanceData;

				var moduleBehaviors = getBehaviors(instanceData),
					behaviorInstance;

				for (var i = 0, len = moduleBehaviors.length; i < len; i++) {
					behaviorInstance = moduleBehaviors[i];
					callModuleMethod(behaviorInstance, 'init');
				}

				// Initialize module only after behaviors are initialized
				callModuleMethod(instanceData.instance, 'init');

				// Bind events after initialization is complete to avoid event timing issues
				bindEventListeners(instanceData);

			}

			return this;
		},

		/**
		 * Ends the lifecycle of a module (unregisters and unbinds listeners)
		 * @param {HTMLElement} element DOM element associated with module to be stopped
		 * @returns {Box.Application} The application object.
		 * @throws {Error} If a module being stopped doesn't exist
		 */
		stop(element) {
			var instanceData = getInstanceDataByElement(element);

			if (!instanceData) {

				if (globalConfig.debug) {
					error(new Error('Unable to stop module associated with element: ' + element.id));
					return this;
				}

			} else {

				unbindEventListeners(instanceData);

				// Call these in reverse order
				var moduleBehaviors = getBehaviors(instanceData);
				var behaviorInstance;
				for (var i = moduleBehaviors.length - 1; i >= 0; i--) {
					behaviorInstance = moduleBehaviors[i];
					callModuleMethod(behaviorInstance, 'destroy');
				}

				callModuleMethod(instanceData.instance, 'destroy');

				delete instances[element.id];
			}

			return this;
		},

		/**
		 * Starts all modules contained within an element
		 * @param {HTMLElement} root DOM element which contains modules
		 * @returns {Box.Application} The application object.
		 */
		startAll(root) {
			var moduleElements = Box.DOM.queryAll(root, MODULE_SELECTOR);

			for (var i = 0, len = moduleElements.length; i < len; i++) {
				this.start(moduleElements[i]);
			}

			return this;
		},

		/**
		 * Stops all modules contained within an element
		 * @param {HTMLElement} root DOM element which contains modules
		 * @returns {Box.Application} The application object.
		 */
		stopAll(root) {
			var moduleElements = Box.DOM.queryAll(root, MODULE_SELECTOR);

			for (var i = 0, len = moduleElements.length; i < len; i++) {
				this.stop(moduleElements[i]);
			}

			return this;
		},

		//----------------------------------------------------------------------
		// Module-Related
		//----------------------------------------------------------------------

		/**
		 * Registers a new module
		 * @param {string} moduleName Unique module identifier
		 * @param {Function} creator Factory function used to generate the module
		 * @returns {Box.Application} The application object.
		 * @throws {Error} If a module has already been added
		 */
		addModule(moduleName, creator) {
			if (typeof modules[moduleName] !== 'undefined') {
				error(new Error('Module ' + moduleName + ' has already been added.'));
				return this;
			}

			modules[moduleName] = {
				creator: creator,
				counter: 1 // increments for each new instance
			};

			return this;
		},

		/**
		 * Returns any configuration information that was output into the page
		 * for this instance of the module.
		 * @param {HTMLElement} element The HTML element associated with a module.
		 * @param {string} [name] Specific config parameter
		 * @returns {*} config value or the entire configuration JSON object
		 *                if no name is specified (null if either not found)
		 */
		getModuleConfig(element, name) {

			var instanceData = getInstanceDataByElement(element);
			var moduleConfig = null;

			if (instanceData && instanceData.config) {
				// Check if we've already read the configurations before
				moduleConfig = instanceData.config;
			} else {
				// Read the special script element that stores module configuration in the markup
				var configElement = Box.DOM.query(element, 'script[type="text/x-config"]');

				// <script> tag supports .text property
				if (configElement) {
					try {
						moduleConfig = JSON.parse(configElement.text);
					} catch (exception) {
						error(new Error('Module with id ' + element.id + ' has a malformed config.'));
					}
				}

				// Cache the configurations for performance, if the module instance has been created
				if (instanceData) {
					instanceData.config = moduleConfig;
				}
			}

			if (!moduleConfig) {
				return null;
			} else if (typeof name === 'undefined') {
				return moduleConfig;
			} else if (name in moduleConfig) {
				return moduleConfig[name];
			} else {
				return null;
			}

		},

		//----------------------------------------------------------------------
		// Service-Related
		//----------------------------------------------------------------------

		/**
		 * Registers a new service
		 * @param {string} serviceName Unique service identifier
		 * @param {Function} creator Factory function used to generate the service
		 * @returns {Box.Application} The application object.
		 * @throws {Error} If a service has already been added
		 */
		addService(serviceName, creator) {

			if (typeof services[serviceName] !== 'undefined') {
				error(new Error('Service ' + serviceName + ' has already been added.'));
				return this;
			}

			services[serviceName] = {
				creator: creator,
				instance: null
			};

			return this;
		},

		/**
		 * Returns the requested service
		 * @param {string} serviceName The name of the service to retrieve.
		 * @returns {!Object} An object if the service is found or null if not.
		 */
		getService: getService,

		/**
		 * Checks if a service exists
		 * @param {string} serviceName The name of the service to check.
		 * @returns {boolean} True, if service exist. False, otherwise.
		 */
		hasService(serviceName) {
			return services.hasOwnProperty(serviceName);
		},

		//----------------------------------------------------------------------
		// Behavior-Related
		//----------------------------------------------------------------------

		/**
		 * Registers a new behavior
		 * @param {string} behaviorName Unique behavior identifier
		 * @param {Function} creator Factory function used to generate the behavior
		 * @returns {Box.Application} The application object.
		 * @throws {Error} If a behavior has already been added
		 */
		addBehavior(behaviorName, creator) {
			if (typeof behaviors[behaviorName] !== 'undefined') {
				error(new Error('Behavior ' + behaviorName + ' has already been added.'));
				return this;
			}

			behaviors[behaviorName] = {
				creator: creator,
				instance: null
			};

			return this;
		},

		//----------------------------------------------------------------------
		// Messaging
		//----------------------------------------------------------------------

		/**
		 * Broadcasts a message to all registered listeners
		 * @param {string} name Name of the message
		 * @param {*} [data] Custom parameters for the message
		 * @returns {Box.Application} The application object.
		 */
		broadcast(name, data) {
			var i,
				id,
				instanceData,
				behaviorInstance,
				moduleBehaviors;

			for (id in instances) {

				if (instances.hasOwnProperty(id)) {
					instanceData = instances[id];

					// Module message handler is called first
					callMessageHandler(instanceData.instance, name, data);

					// And then any message handlers defined in module's behaviors
					moduleBehaviors = getBehaviors(instanceData);
					for (i = 0; i < moduleBehaviors.length; i++) {
						behaviorInstance = moduleBehaviors[i];
						callMessageHandler(behaviorInstance, name, data);
					}
				}

			}

			// also fire an event so non-T3 code can listen for the message
			this.fire('message', {
				message: name,
				messageData: data
			});

			return this;
		},

		//----------------------------------------------------------------------
		// Global Configuration
		//----------------------------------------------------------------------

		/**
		 * Returns a global variable
		 * @param {string} name Specific global var name
		 * @returns {*} returns the window-scope variable matching the name, null otherwise
		 */
		getGlobal(name) {
			if (name in window) {
				return window[name];
			} else {
				return null;
			}
		},

		/**
		 * Returns global configuration data
		 * @param {string} [name] Specific config parameter
		 * @returns {*} config value or the entire configuration JSON object
		 *                if no name is specified (null if neither not found)
		 */
		getGlobalConfig(name) {
			if (typeof name === 'undefined') {
				return globalConfig;
			} else if (name in globalConfig) {
				return globalConfig[name];
			} else {
				return null;
			}
		},

		/**
		 * Sets the global configuration data
		 * @param {Object} config Global configuration object
		 * @returns {Box.Application} The application object.
		 */
		setGlobalConfig(config) {
			if (initialized) {
				error(new Error('Cannot set global configuration after application initialization'));
				return this;
			}

			Object.assign(globalConfig, config);
			return this;
		},

    resetGlobalConfig(){
      return globalConfig = {};
    },

		//----------------------------------------------------------------------
		// Error reporting
		//----------------------------------------------------------------------

		/**
		 * Overrides default error handler
		 * @param {Function} exceptionHandler handling function that takes an
		 * exception as argument. Must be called before init.
		 * @returns {void}
		 */
		setErrorHandler(exceptionHandler) {
			customErrorHandler = exceptionHandler;
		},

		/**
		 * Signals that an error has occurred. If in development mode, an error
		 * is thrown. If in production mode, an event is fired.
		 * @param {Error} [exception] The exception object to use.
		 * @returns {void}
		 */
		reportError: error,

		/**
		 * Signals that an warning has occurred.
		 * If in development mode, console.warn is invoked.
		 * If in production mode, an event is fired.
		 * @param {*} data A message string or arbitrary data
		 * @returns {void}
		 */
		reportWarning(data) {
			if (globalConfig.debug) {
				// We grab console via getGlobal() so we can stub it out in tests
				var globalConsole = this.getGlobal('console');
				if (globalConsole && globalConsole.warn) {
					globalConsole.warn(data);
				}
			} else {
				application.fire('warning', data);
			}
		},

		/**
		 * Display console info messages.
		 * If in development mode, console.info is invoked.
		 * @param {*} data A message string or arbitrary data
		 * @returns {void}
		 */
		reportInfo(data) {
			if (globalConfig.debug) {
				// We grab console via getGlobal() so we can stub it out in tests
				var globalConsole = this.getGlobal('console');
				if (globalConsole && globalConsole.info) {
					globalConsole.info(data);
				}
			}
		}
};

module.exports = { globalConfig, appMethods, error};