/**
 * @fileoverview Contains the Context type which is used by modules to interact
 *               with the environment.
 * @author Box
 */

	//-------------------------------------------------------------------------
	// Passthrough Methods
	//-------------------------------------------------------------------------

	class Context {
	/**
	 * The object type that modules use to interact with the environment. Used
	 * exclusively within Box.Application, but exposed publicly for easy testing.
	 * @param {Application} application The application object to wrap.
	 * @param {HTMLElement} element Module's DOM element
	 * @constructor
	 */
		constructor(application, element) {
			this.application = application;
			this.element = element;
		}

		/**
		 * Passthrough method to application that broadcasts messages.
		 * @param {string} name Name of the message event
		 * @param {*} [data] Custom parameters for the message
		 * @returns {void}
		 */
		broadcast(name, data) {
			this.application.broadcast(name, data);
		}

		/**
		 * Passthrough method to application that retrieves services.
		 * @param {string} serviceName The name of the service to retrieve.
		 * @returns {Object|null} An object if the service is found or null if not.
		 */
		getService(serviceName) {
			return this.application.getService(serviceName);
		}

		/**
		 * Checks if a service exists
		 * @param {string} serviceName The name of the service to check.
		 * @returns {boolean} True, if service exist. False, otherwise.
		 */
		hasService(serviceName) {
			return this.application.hasService(serviceName);
		}

		/**
		 * Returns any configuration information that was output into the page
		 * for this instance of the module.
		 * @param {string} [name] Specific config parameter
		 * @returns {*} config value or the entire configuration JSON object
		 *                if no name is specified (null if either not found)
		 */
		getConfig(name) {
			return this.application.getModuleConfig(this.element, name);
		}

		/**
		 * Returns a global variable
		 * @param {string} name Specific global var name
		 * @returns {*} returns the window-scope variable matching the name, null otherwise
		 */
		getGlobal(name) {
			return this.application.getGlobal(name);
		}

		/**
		 * Returns global configuration data
		 * @param {string} [name] Specific config parameter
		 * @returns {*} config value or the entire configuration JSON object
		 *                if no name is specified (null if either not found)
		 */
		getGlobalConfig(name) {
			return this.application.getGlobalConfig(name);
		}

		/**
		 * Passthrough method that signals that an error has occurred. If in development mode, an error
		 * is thrown. If in production mode, an event is fired.
		 * @param {Error} [exception] The exception object to use.
		 * @returns {void}
		 */
		reportError(exception) {
			this.application.reportError(exception);
		}

		//-------------------------------------------------------------------------
		// Service Shortcuts
		//-------------------------------------------------------------------------

		/**
		 * Returns the element that represents the module.
		 * @returns {HTMLElement} The element representing the module.
		 */
		getElement() {
			return this.element;
		}

	};

	module.exports = Context;
