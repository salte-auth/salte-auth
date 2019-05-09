/**
 * @salte-auth/salte-auth JavaScript Library v2.14.0
 *
 * @license MIT (https://github.com/salte-auth/salte-auth/blob/master/LICENSE)
 *
 * Made with ♥ by Nick Woodward <nick@salte.io>, Dave Woodward <dave@salte.io>
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("salte.auth", [], factory);
	else if(typeof exports === 'object')
		exports["salte.auth"] = factory();
	else
		root["salte.auth"] = factory();
})(window, function() {
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalteAuth", function() { return SalteAuth; });
/* harmony import */ var lodash_assign__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var lodash_assign__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_assign__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_defaultsDeep__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(54);
/* harmony import */ var lodash_defaultsDeep__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_defaultsDeep__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(106);
/* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_get__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash_set__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(118);
/* harmony import */ var lodash_set__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_set__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(120);
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(125);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _salte_auth_providers_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(126);
/* harmony import */ var _salte_auth_profile_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(133);
/* harmony import */ var _salte_auth_utilities_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(177);
/* harmony import */ var _salte_auth_mixin_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(178);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }











/** @ignore */

var logger = debug__WEBPACK_IMPORTED_MODULE_5___default()('@salte-auth/salte-auth');
/**
 * Disable certain security validations if your provider doesn't support them.
 * @typedef {Object} Validation
 * @property {Boolean} [nonce=true] Passing false will disable nonce validation, leaving you vulnerable to replay attacks.
 * @property {Boolean} [state=true] Passing false will disable state validation, leaving you vulnerable to XSRF attacks.
 * @property {Boolean} [azp=true] Passing false will disable azp validation.
 * @property {Boolean} [aud=true] Passing false will disable aud validation.
 */

/**
 * Disable certain security validations if your provider doesn't support them.
 * @typedef {Object} RedirectURLs
 * @property {String} [loginUrl] The redirect url specified in your identity provider for logging in.
 * @property {String} [logoutUrl] The redirect url specified in your identity provider for logging out.
 */

/**
 * The configuration for salte auth
 * @typedef {Object} Config
 * @property {String} providerUrl The base url of your identity provider.
 * @property {('id_token'|'id_token token'|'code')} responseType The response type to authenticate with.
 * @property {String|RedirectURLs} redirectUrl The redirect url specified in your identity provider.
 * @property {String} clientId The client id of your identity provider
 * @property {String} scope A list of space-delimited claims used to determine what user information is provided and what access is given. Most providers require 'openid'.
 * @property {Boolean|Array<String>} routes A list of secured routes. If true is provided then all routes are secured.
 * @property {Array<String|RegExp>} endpoints A list of secured endpoints.
 * @property {('auth0'|'azure'|'cognito'|'wso2'|'okta')} provider The identity provider you're using.
 * @property {('iframe'|'redirect'|false)} [loginType='iframe'] The automated login type to use.
 * @property {Function} [redirectLoginCallback] A callback that is invoked when a redirect login fails or succeeds.
 * @property {('session'|'local')} [storageType='session'] The Storage api to keep authenticate information stored in.
 * @property {Boolean|Validation} [validation] Used to disable certain security validations if your provider doesn't support them.
 * @property {Boolean} [autoRefresh=true] Automatically refreshes the users token upon switching tabs or one minute prior to expiration.
 * @property {Number} [autoRefreshBuffer=60000] A number of miliseconds before token expiration to refresh.
 * @property {Object} [queryParams] A key-value set of additional query params to attached to the login request.
 */

/**
 * The configuration for salte auth
 * @typedef {Object} LoginConfig
 * @property {Boolean} [noPrompt=false] Disables login prompts, this should only be used for token renewal!
 * @property {(false|'errors'|'all')} [clear='all'] Whether to clear "all" profile information, only "errors", or nothing.
 * @property {Boolean} [events=true] Whether events should be fired off if the login is successful or not.
 */

/**
 * Authentication Controller
 */

var SalteAuth =
/*#__PURE__*/
function () {
  /**
   * Sets up Salte Auth
   * @param {Config} config configuration for salte auth
   */
  function SalteAuth(config) {
    var _this = this;

    _classCallCheck(this, SalteAuth);

    if (window.salte.auth) {
      return window.salte.auth;
    }

    if (!config) {
      throw new ReferenceError('A config must be provided.');
    }
    /**
     * The supported identity providers
     * @type {Providers}
     * @private
     */


    this.$providers = _salte_auth_providers_js__WEBPACK_IMPORTED_MODULE_6__["Providers"];
    /**
     * The active authentication promises
     * @private
     */

    this.$promises = {};
    /**
     * The active authentication timeouts
     * @private
     */

    this.$timeouts = {};
    /**
     * The registered listeners
     * @private
     */

    this.$listeners = {};
    /**
     * The configuration for salte auth
     * @type {Config}
     * @private
     */

    this.$config = config;
    this.$config = lodash_defaultsDeep__WEBPACK_IMPORTED_MODULE_1___default()(config, this.$provider.defaultConfig, {
      loginType: 'iframe',
      autoRefresh: true,
      autoRefreshBuffer: 60000
    });
    /**
     * Various utility functions for salte auth
     * @type {SalteAuthUtilities}
     * @private
     */

    this.$utilities = new _salte_auth_utilities_js__WEBPACK_IMPORTED_MODULE_8__["SalteAuthUtilities"](this.$config);
    /**
     * The user profile for salte auth
     * @type {SalteAuthProfile}
     */

    this.profile = new _salte_auth_profile_js__WEBPACK_IMPORTED_MODULE_7__["SalteAuthProfile"](this.$config);
    /**
     * A mixin built for Web Components
     *
     * @example
     * class MyElement extends auth.mixin(HTMLElement) {
     *   constructor() {
     *     super();
     *
     *     console.log(this.auth); // This is the same as auth
     *     console.log(this.user); // This is the same as auth.profile.userInfo.
     *     console.log(this.authenticated); // This is the same as auth.profile.idTokenExpired.
     *   }
     * }
     */

    this.mixin = Object(_salte_auth_mixin_js__WEBPACK_IMPORTED_MODULE_9__["SalteAuthMixinGenerator"])(this);

    if (this.$utilities.$iframe) {
      logger('Detected iframe, removing...');
      this.profile.$parseParams();
      parent.document.body.removeChild(this.$utilities.$iframe);
    } else if (this.$utilities.$popup) {
      logger('Popup detected!');
    } else if (this.profile.$redirectUrl && location.href !== this.profile.$redirectUrl) {
      logger('Redirect detected!');
      this.profile.$parseParams();
      var error = this.profile.$validate(); // Delay for an event loop to give users time to register a listener.

      setTimeout(function () {
        var action = _this.profile.$actions(_this.profile.$state);

        if (error) {
          _this.profile.$clear();
        } else {
          logger("Navigating to Redirect URL... (".concat(_this.profile.$redirectUrl, ")"));

          _this.$utilities.$navigate(_this.profile.$redirectUrl);

          _this.profile.$redirectUrl = undefined;
        }

        if (action === 'login') {
          _this.$fire('login', error || null, _this.profile.code || _this.profile.userInfo);
        } else if (action === 'logout') {
          _this.$fire('logout', error);
        } // TODO(v3.0.0): Remove the `redirectLoginCallback` api from `salte-auth`.


        _this.$config.redirectLoginCallback && _this.$config.redirectLoginCallback(error);
      });
    } else {
      logger('Setting up interceptors...');
      this.$utilities.addXHRInterceptor(function (request, data) {
        if (_this.$config.responseType !== 'code' && _this.$utilities.checkForMatchingUrl(request.$url, _this.$config.endpoints)) {
          return _this.retrieveAccessToken().then(function (accessToken) {
            request.setRequestHeader('Authorization', "Bearer ".concat(accessToken));
          });
        }
      });
      this.$utilities.addFetchInterceptor(function (request) {
        if (_this.$config.responseType !== 'code' && _this.$utilities.checkForMatchingUrl(request.url, _this.$config.endpoints)) {
          return _this.retrieveAccessToken().then(function (accessToken) {
            request.headers.set('Authorization', "Bearer ".concat(accessToken));
          });
        }
      });
      logger('Setting up route change detectors...');
      window.addEventListener('popstate', this.$$onRouteChanged.bind(this), {
        passive: true
      });
      document.addEventListener('click', this.$$onRouteChanged.bind(this), {
        passive: true
      });
      setTimeout(this.$$onRouteChanged.bind(this));
      logger('Setting up automatic renewal of token...');
      this.on('login', function (error) {
        if (error) return;

        _this.$$refreshToken();
      });
      this.on('refresh', function (error) {
        if (error) return;

        _this.$$refreshToken();
      });
      this.on('logout', function () {
        clearTimeout(_this.$timeouts.refresh);
      });

      if (!this.profile.idTokenExpired) {
        this.$$refreshToken();
      }

      document.addEventListener('visibilitychange', this.$$onVisibilityChanged.bind(this), {
        passive: true
      });
      this.$fire('create', null, this);
    } // TODO(v3.0.0): Revoke singleton status from `salte-auth`.


    window.salte.auth = this;

    if (this.$config.redirectLoginCallback) {
      console.warn("The \"redirectLoginCallback\" api has been deprecated in favor of the \"on\" api, see http://bit.ly/salte-auth-on for more info.");
    }
  }
  /**
   * Returns the configured provider
   * @type {Class|Object}
   * @private
   */


  _createClass(SalteAuth, [{
    key: "$loginUrl",

    /**
     * The authentication url to retrieve the id token
     * @param {Boolean} refresh Whether this request is intended to refresh the token.
     * @return {String} the computed login url
     * @private
     */
    value: function $loginUrl(refresh) {
      this.profile.$localState = uuid__WEBPACK_IMPORTED_MODULE_4___default.a.v4();
      this.profile.$nonce = uuid__WEBPACK_IMPORTED_MODULE_4___default.a.v4();
      var authorizeEndpoint = "".concat(this.$config.providerUrl, "/authorize");

      if (this.$provider.authorizeEndpoint) {
        authorizeEndpoint = this.$provider.authorizeEndpoint.call(this, this.$config);
      }

      return this.$utilities.createUrl(authorizeEndpoint, lodash_assign__WEBPACK_IMPORTED_MODULE_0___default()({
        'state': this.profile.$localState,
        'nonce': this.profile.$nonce,
        'response_type': this.$config.responseType,
        'redirect_uri': this.$config.redirectUrl && this.$config.redirectUrl.loginUrl || this.$config.redirectUrl,
        'client_id': this.$config.clientId,
        'scope': this.$config.scope,
        'prompt': refresh ? 'none' : undefined
      }, this.$config.queryParams));
    }
    /**
     * The url to logout of the configured provider
     * @type {String}
     * @private
     */

  }, {
    key: "on",

    /**
     * Listens for an event to be invoked.
     * @param {('login'|'logout'|'refresh'|'expired')} eventType the event to listen for.
     * @param {Function} callback A callback that fires when the specified event occurs.
     *
     * @example
     * auth.on('login', (error, user) => {
     *   if (error) {
     *     console.log('something bad happened!');
     *   }
     *
     *   console.log(user); // This is the same as auth.profile.userInfo.
     * });
     *
     * @example
     * window.addEventListener('salte-auth-login', (event) => {
     *   if (event.detail.error) {
     *     console.log('something bad happened!');
     *   }
     *
     *   console.log(event.detail.data); // This is the same as auth.profile.userInfo.
     * });
     */
    value: function on(eventType, callback) {
      if (['login', 'logout', 'refresh', 'expired'].indexOf(eventType) === -1) {
        throw new ReferenceError("Unknown Event Type (".concat(eventType, ")"));
      } else if (typeof callback !== 'function') {
        throw new ReferenceError('Invalid callback provided!');
      }

      this.$listeners[eventType] = this.$listeners[eventType] || [];
      this.$listeners[eventType].push(callback);
    }
    /**
     * Deregister a callback previously registered.
     * @param {('login'|'logout'|'refresh'|'expired')} eventType the event to deregister.
     * @param {Function} callback A callback that fires when the specified event occurs.
     *
     * @example
     * const someFunction = function() {};
     *
     * auth.on('login', someFunction);
     *
     * auth.off('login', someFunction);
     */

  }, {
    key: "off",
    value: function off(eventType, callback) {
      if (['login', 'logout', 'refresh', 'expired'].indexOf(eventType) === -1) {
        throw new ReferenceError("Unknown Event Type (".concat(eventType, ")"));
      } else if (typeof callback !== 'function') {
        throw new ReferenceError('Invalid callback provided!');
      }

      var eventListeners = this.$listeners[eventType];
      if (!eventListeners || !eventListeners.length) return;
      var index = eventListeners.indexOf(callback);
      eventListeners.splice(index, 1);
    }
    /**
     * Fires off an event to a given set of listeners
     * @param {String} eventType The event that occurred.
     * @param {Error} error The error tied to this event.
     * @param {*} data The data tied to this event.
     * @private
     */

  }, {
    key: "$fire",
    value: function $fire(eventType, error, data) {
      var event = document.createEvent('Event');
      event.initEvent("salte-auth-".concat(eventType), false, true);
      event.detail = {
        error: error,
        data: data
      };
      window.dispatchEvent(event);
      var eventListeners = this.$listeners[eventType];
      if (!eventListeners || !eventListeners.length) return;
      eventListeners.forEach(function (listener) {
        return listener(error, data);
      });
    }
    /**
     * Authenticates using the iframe-based OAuth flow.
     * @param {Boolean|LoginConfig} config Whether this request is intended to refresh the token.
     * @return {Promise<Object>} a promise that resolves when we finish authenticating
     *
     * @example
     * auth.loginWithIframe().then((user) => {
     *   console.log(user); // This is the same as auth.profile.userInfo.
     * }).catch((error) => {
     *   console.error('Whoops something went wrong!', error);
     * });
     */

  }, {
    key: "loginWithIframe",
    value: function loginWithIframe(config) {
      var _this2 = this;

      if (this.$promises.login) {
        return this.$promises.login;
      } // TODO(v3.0.0): Remove backwards compatibility with refresh boolean.


      if (typeof config === 'boolean') {
        config = {
          noPrompt: config,
          clear: config ? 'errors' : undefined,
          events: false
        };
      }

      config = lodash_defaultsDeep__WEBPACK_IMPORTED_MODULE_1___default()(config, {
        noPrompt: false,
        clear: 'all',
        events: true
      });

      if (config.clear === 'all') {
        this.profile.$clear();
      } else if (config.clear === 'errors') {
        this.profile.$clearErrors();
      }

      this.$promises.login = this.$utilities.createIframe(this.$loginUrl(config.noPrompt), !config.noPrompt).then(function () {
        _this2.$promises.login = null;

        var error = _this2.profile.$validate();

        if (error) {
          return Promise.reject(error);
        }

        var response = _this2.profile.code || _this2.profile.userInfo;

        if (config.events) {
          _this2.$fire('login', null, response);
        }

        return response;
      }).catch(function (error) {
        _this2.$promises.login = null;

        if (config.events) {
          _this2.$fire('login', error);
        }

        return Promise.reject(error);
      });
      return this.$promises.login;
    }
    /**
     * Authenticates using the popup-based OAuth flow.
     * @return {Promise<Object>} a promise that resolves when we finish authenticating
     *
     * @example
     * auth.loginWithPopup().then((user) => {
     *   console.log(user); // This is the same as auth.profile.userInfo.
     * }).catch((error) => {
     *   console.error('Whoops something went wrong!', error);
     * });
     */

  }, {
    key: "loginWithPopup",
    value: function loginWithPopup() {
      var _this3 = this;

      if (this.$promises.login) {
        return this.$promises.login;
      }

      this.profile.$clear();
      this.$promises.login = this.$utilities.openPopup(this.$loginUrl()).then(function () {
        _this3.$promises.login = null;

        _this3.profile.$parseParams();

        var error = _this3.profile.$validate();

        if (error) {
          _this3.profile.$clear();

          return Promise.reject(error);
        }

        var response = _this3.profile.code || _this3.profile.userInfo;

        _this3.$fire('login', null, response);

        return response;
      }).catch(function (error) {
        _this3.$promises.login = null;

        _this3.$fire('login', error);

        return Promise.reject(error);
      });
      return this.$promises.login;
    }
    /**
     * Authenticates using the tab-based OAuth flow.
     * @return {Promise<Object>} a promise that resolves when we finish authenticating
     *
     * @example
     * auth.loginWithNewTab().then((user) => {
     *   console.log(user); // This is the same as auth.profile.userInfo.
     * }).catch((error) => {
     *   console.error('Whoops something went wrong!', error);
     * });
     */

  }, {
    key: "loginWithNewTab",
    value: function loginWithNewTab() {
      var _this4 = this;

      if (this.$promises.login) {
        return this.$promises.login;
      }

      this.profile.$clear();
      this.$promises.login = this.$utilities.openNewTab(this.$loginUrl()).then(function () {
        _this4.$promises.login = null;

        _this4.profile.$parseParams();

        var error = _this4.profile.$validate();

        if (error) {
          _this4.profile.$clear();

          return Promise.reject(error);
        }

        var response = _this4.profile.code || _this4.profile.userInfo;

        _this4.$fire('login', null, response);

        return response;
      }).catch(function (error) {
        _this4.$promises.login = null;

        _this4.$fire('login', error);

        return Promise.reject(error);
      });
      return this.$promises.login;
    }
    /**
     * Authenticates using the redirect-based OAuth flow.
     * @param {String} redirectUrl override for the redirect url, by default this will try to redirect the user back where they started.
     * @return {Promise} a promise intended to block future login attempts.
     *
     * @example
     * auth.loginWithRedirect(); // Don't bother with utilizing the promise here, it never resolves.
     */

  }, {
    key: "loginWithRedirect",
    value: function loginWithRedirect(redirectUrl) {
      if (this.$config.redirectLoginCallback) {
        console.warn("The \"redirectLoginCallback\" api has been deprecated in favor of the \"on\" api, see http://bit.ly/salte-auth-on for more info.");
      }

      if (this.$promises.login) {
        return this.$promises.login;
      } // NOTE: This prevents the other login types from racing "loginWithRedirect".
      // Without this someone could potentially call login somewhere else before
      // the app has a change to redirect. Which could result in an invalid state.


      this.$promises.login = new Promise(function () {});
      this.profile.$clear();
      this.profile.$redirectUrl = redirectUrl && this.$utilities.resolveUrl(redirectUrl) || this.profile.$redirectUrl || location.href;
      var url = this.$loginUrl();
      this.profile.$actions(this.profile.$localState, 'login');
      this.$utilities.$navigate(url);
      return this.$promises.login;
    }
    /**
     * Unauthenticates using the iframe-based OAuth flow.
     * @return {Promise} a promise that resolves when we finish deauthenticating
     *
     * @example
     * auth.logoutWithIframe().then(() => {
     *   console.log('success!');
     * }).catch((error) => {
     *   console.error('Whoops something went wrong!', error);
     * });
     */

  }, {
    key: "logoutWithIframe",
    value: function logoutWithIframe() {
      var _this5 = this;

      if (this.$promises.logout) {
        return this.$promises.logout;
      }

      var deauthorizeUrl = this.$deauthorizeUrl;
      this.profile.$clear();
      this.$promises.logout = this.$utilities.createIframe(deauthorizeUrl).then(function () {
        _this5.$promises.logout = null;

        _this5.$fire('logout');
      }).catch(function (error) {
        _this5.$promises.logout = null;

        _this5.$fire('logout', error);

        return Promise.reject(error);
      });
      return this.$promises.logout;
    }
    /**
     * Unauthenticates using the popup-based OAuth flow.
     * @return {Promise} a promise that resolves when we finish deauthenticating
     *
     * @example
     * auth.logoutWithPopup().then(() => {
     *   console.log('success!');
     * }).catch((error) => {
     *   console.error('Whoops something went wrong!', error);
     * });
     */

  }, {
    key: "logoutWithPopup",
    value: function logoutWithPopup() {
      var _this6 = this;

      if (this.$promises.logout) {
        return this.$promises.logout;
      }

      var deauthorizeUrl = this.$deauthorizeUrl;
      this.profile.$clear();
      this.$promises.logout = this.$utilities.openPopup(deauthorizeUrl).then(function () {
        _this6.$promises.logout = null;

        _this6.$fire('logout');
      }).catch(function (error) {
        _this6.$promises.logout = null;

        _this6.$fire('logout', error);

        return Promise.reject(error);
      });
      return this.$promises.logout;
    }
    /**
     * Unauthenticates using the tab-based OAuth flow.
     * @return {Promise} a promise that resolves when we finish deauthenticating
     *
     * @example
     * auth.logoutWithNewTab().then(() => {
     *   console.log('success!');
     * }).catch((error) => {
     *   console.error('Whoops something went wrong!', error);
     * });
     */

  }, {
    key: "logoutWithNewTab",
    value: function logoutWithNewTab() {
      var _this7 = this;

      if (this.$promises.logout) {
        return this.$promises.logout;
      }

      var deauthorizeUrl = this.$deauthorizeUrl;
      this.profile.$clear();
      this.$promises.logout = this.$utilities.openNewTab(deauthorizeUrl).then(function () {
        _this7.$promises.logout = null;

        _this7.$fire('logout');
      }).catch(function (error) {
        _this7.$promises.logout = null;

        _this7.$fire('logout', error);

        return Promise.reject(error);
      });
      return this.$promises.logout;
    }
    /**
     * Logs the user out of their configured identity provider.
     *
     * @example
     * auth.logoutWithRedirect();
     */

  }, {
    key: "logoutWithRedirect",
    value: function logoutWithRedirect() {
      var deauthorizeUrl = this.$deauthorizeUrl;
      this.profile.$clear();
      this.profile.$actions(this.profile.$localState, 'logout');
      this.$utilities.$navigate(deauthorizeUrl);
    }
    /**
     * Refreshes the users tokens and renews their session.
     * @return {Promise} a promise that resolves when we finish renewing the users tokens.
     */

  }, {
    key: "refreshToken",
    value: function refreshToken() {
      var _this8 = this;

      if (this.$promises.token) {
        return this.$promises.token;
      }

      this.$promises.token = this.loginWithIframe(true).then(function (user) {
        _this8.$promises.token = null;

        var error = _this8.profile.$validate(true);

        if (error) {
          return Promise.reject(error);
        }

        _this8.$promises.token = null;

        _this8.$fire('refresh', null, user);

        return user;
      }).catch(function (error) {
        _this8.$promises.token = null;

        _this8.$fire('refresh', error);

        return Promise.reject(error);
      });
      return this.$promises.token;
    }
    /**
     * Registers a timeout that will automatically refresh the id token
     */

  }, {
    key: "$$refreshToken",
    value: function $$refreshToken() {
      var _this9 = this;

      if (this.$timeouts.refresh !== undefined) {
        clearTimeout(this.$timeouts.refresh);
      }

      if (this.$timeouts.expired !== undefined) {
        clearTimeout(this.$timeouts.expired);
      }

      var timeToExpiration = this.profile.userInfo.exp * 1000 - Date.now();
      this.$timeouts.refresh = setTimeout(function () {
        // Allows Auto Refresh to be disabled
        if (_this9.$config.autoRefresh) {
          _this9.refreshToken().catch(function (error) {
            console.error(error);
          });
        } else {
          _this9.$fire('refresh');
        }
      }, Math.max(timeToExpiration - this.$config.autoRefreshBuffer, 0));
      this.$timeouts.expired = setTimeout(function () {
        _this9.$fire('expired');
      }, Math.max(timeToExpiration, 0));
    }
    /**
     * Authenticates, requests the access token, and returns it if necessary.
     * @return {Promise<string>} a promise that resolves when we retrieve the access token
     */

  }, {
    key: "retrieveAccessToken",
    value: function retrieveAccessToken() {
      var _this10 = this;

      if (this.$promises.token) {
        logger('Existing token request detected, resolving...');
        return this.$promises.token;
      }

      this.$promises.token = Promise.resolve();

      if (this.$config.responseType === 'code' && !this.profile.code || this.$config.responseType !== 'code' && this.profile.idTokenExpired) {
        logger('id token has expired, reauthenticating...');

        if (this.$config.loginType === 'iframe') {
          logger('Initiating the iframe flow...');
          this.$promises.token = this.loginWithIframe();
        } else if (this.$config.loginType === 'redirect') {
          this.$promises.token = this.loginWithRedirect();
        } else if (this.$config.loginType === false) {
          if (this.$promises.login) {
            this.$promises.token = this.$promises.login;
          } else {
            this.$promises.token = null;
            return Promise.reject(new ReferenceError('Automatic login is disabled, please login before making any requests!'));
          }
        } else {
          this.$promises.token = null;
          return Promise.reject(new ReferenceError("Invalid Login Type (".concat(this.$config.loginType, ")")));
        }
      }

      if (this.$config.responseType !== 'code') {
        this.$promises.token = this.$promises.token.then(function () {
          _this10.profile.$clearErrors();

          if (_this10.profile.accessTokenExpired) {
            logger('Access token has expired, renewing...');
            return _this10.$utilities.createIframe(_this10.$accessTokenUrl).then(function () {
              var error = _this10.profile.$validate(true);

              if (error) {
                return Promise.reject(error);
              }

              return _this10.profile.$accessToken;
            });
          }

          return _this10.profile.$accessToken;
        });
      }

      if (this.$promises.token) {
        this.$promises.token = this.$promises.token.then(function (response) {
          _this10.$promises.token = null;
          return response;
        }).catch(function (error) {
          _this10.$promises.token = null;
          return Promise.reject(error);
        });
      }

      return this.$promises.token;
    }
    /**
     * Checks if the current route is secured and authenticates the user if necessary
     * @ignore
     */

  }, {
    key: "$$onRouteChanged",
    value: function $$onRouteChanged() {
      logger('Route change detected, determining if the route is secured...');
      if (!this.$utilities.isRouteSecure(location.href, this.$config.routes)) return;
      logger('Route is secure, verifying tokens...');
      this.retrieveAccessToken();
    }
    /**
     * Disables automatic refresh of the token if the page is no longer visible
     * @ignore
     */

  }, {
    key: "$$onVisibilityChanged",
    value: function $$onVisibilityChanged() {
      var _this11 = this;

      logger('Visibility change detected, deferring to the next event loop...');
      logger('Determining if the id token has expired...');
      if (this.profile.idTokenExpired || !this.$config.autoRefresh) return;

      if (this.$utilities.$hidden) {
        logger('Page is hidden, refreshing the token...');
        this.refreshToken().then(function () {
          logger('Disabling automatic renewal of the token...');
          clearTimeout(_this11.$timeouts.refresh);
          _this11.$timeouts.refresh = null;
        });
      } else {
        logger('Page is visible restarting automatic token renewal...');
        this.$$refreshToken();
      }
    }
  }, {
    key: "$provider",
    get: function get() {
      if (!this.$config.provider) {
        throw new ReferenceError('A provider must be specified');
      }

      if (typeof this.$config.provider === 'string') {
        var provider = this.$providers[this.$config.provider];

        if (!provider) {
          throw new ReferenceError("Unknown Provider (".concat(this.$config.provider, ")"));
        }

        return provider;
      }

      return this.$config.provider;
    }
    /**
     * The authentication url to retrieve the access token
     * @type {String}
     * @private
     */

  }, {
    key: "$accessTokenUrl",
    get: function get() {
      this.profile.$localState = uuid__WEBPACK_IMPORTED_MODULE_4___default.a.v4();
      this.profile.$nonce = uuid__WEBPACK_IMPORTED_MODULE_4___default.a.v4();
      var authorizeEndpoint = "".concat(this.$config.providerUrl, "/authorize");

      if (this.$provider.authorizeEndpoint) {
        authorizeEndpoint = this.$provider.authorizeEndpoint.call(this, this.$config);
      }

      return this.$utilities.createUrl(authorizeEndpoint, lodash_assign__WEBPACK_IMPORTED_MODULE_0___default()({
        'state': this.profile.$localState,
        'nonce': this.profile.$nonce,
        'response_type': 'token',
        'redirect_uri': this.$config.redirectUrl && this.$config.redirectUrl.loginUrl || this.$config.redirectUrl,
        'client_id': this.$config.clientId,
        'scope': this.$config.scope,
        'prompt': 'none'
      }, this.$config.queryParams));
    }
  }, {
    key: "$deauthorizeUrl",
    get: function get() {
      return this.$provider.deauthorizeUrl.call(this, lodash_defaultsDeep__WEBPACK_IMPORTED_MODULE_1___default()(this.$config, {
        idToken: this.profile.$idToken
      }));
    }
  }]);

  return SalteAuth;
}();

lodash_set__WEBPACK_IMPORTED_MODULE_3___default()(window, 'salte.SalteAuth', lodash_get__WEBPACK_IMPORTED_MODULE_2___default()(window, 'salte.SalteAuth', SalteAuth));

/* harmony default export */ __webpack_exports__["default"] = (SalteAuth);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(3),
    copyObject = __webpack_require__(22),
    createAssigner = __webpack_require__(23),
    isArrayLike = __webpack_require__(33),
    isPrototype = __webpack_require__(36),
    keys = __webpack_require__(37);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns own enumerable string keyed properties of source objects to the
 * destination object. Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object` and is loosely based on
 * [`Object.assign`](https://mdn.io/Object/assign).
 *
 * @static
 * @memberOf _
 * @since 0.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assignIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assign({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'c': 3 }
 */
var assign = createAssigner(function(object, source) {
  if (isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }
  for (var key in source) {
    if (hasOwnProperty.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});

module.exports = assign;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(4),
    eq = __webpack_require__(21);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(5);

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(6);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(7),
    getValue = __webpack_require__(20);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(8),
    isMasked = __webpack_require__(17),
    isObject = __webpack_require__(16),
    toSource = __webpack_require__(19);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(9),
    isObject = __webpack_require__(16);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(10),
    getRawTag = __webpack_require__(14),
    objectToString = __webpack_require__(15);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(11);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(12);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(13)))

/***/ }),
/* 13 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(10);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 16 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(18);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(11);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),
/* 19 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(3),
    baseAssignValue = __webpack_require__(4);

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var baseRest = __webpack_require__(24),
    isIterateeCall = __webpack_require__(32);

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(25),
    overRest = __webpack_require__(26),
    setToString = __webpack_require__(28);

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;


/***/ }),
/* 25 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(27);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ }),
/* 27 */
/***/ (function(module, exports) {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var baseSetToString = __webpack_require__(29),
    shortOut = __webpack_require__(31);

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var constant = __webpack_require__(30),
    defineProperty = __webpack_require__(5),
    identity = __webpack_require__(25);

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ }),
/* 30 */
/***/ (function(module, exports) {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ }),
/* 31 */
/***/ (function(module, exports) {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(21),
    isArrayLike = __webpack_require__(33),
    isIndex = __webpack_require__(35),
    isObject = __webpack_require__(16);

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(8),
    isLength = __webpack_require__(34);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),
/* 34 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),
/* 35 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),
/* 36 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(38),
    baseKeys = __webpack_require__(51),
    isArrayLike = __webpack_require__(33);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(39),
    isArguments = __webpack_require__(40),
    isArray = __webpack_require__(43),
    isBuffer = __webpack_require__(44),
    isIndex = __webpack_require__(35),
    isTypedArray = __webpack_require__(47);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),
/* 39 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(41),
    isObjectLike = __webpack_require__(42);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(9),
    isObjectLike = __webpack_require__(42);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),
/* 42 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 43 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(11),
    stubFalse = __webpack_require__(46);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(45)(module)))

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 46 */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(48),
    baseUnary = __webpack_require__(49),
    nodeUtil = __webpack_require__(50);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(9),
    isLength = __webpack_require__(34),
    isObjectLike = __webpack_require__(42);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),
/* 49 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(12);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(45)(module)))

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var isPrototype = __webpack_require__(36),
    nativeKeys = __webpack_require__(52);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(53);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),
/* 53 */
/***/ (function(module, exports) {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(27),
    baseRest = __webpack_require__(24),
    customDefaultsMerge = __webpack_require__(55),
    mergeWith = __webpack_require__(105);

/**
 * This method is like `_.defaults` except that it recursively assigns
 * default properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaults
 * @example
 *
 * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
 * // => { 'a': { 'b': 2, 'c': 3 } }
 */
var defaultsDeep = baseRest(function(args) {
  args.push(undefined, customDefaultsMerge);
  return apply(mergeWith, undefined, args);
});

module.exports = defaultsDeep;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var baseMerge = __webpack_require__(56),
    isObject = __webpack_require__(16);

/**
 * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
 * objects into destination objects that are passed thru.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to merge.
 * @param {Object} object The parent object of `objValue`.
 * @param {Object} source The parent object of `srcValue`.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 * @returns {*} Returns the value to assign.
 */
function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
  if (isObject(objValue) && isObject(srcValue)) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, objValue);
    baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
    stack['delete'](srcValue);
  }
  return objValue;
}

module.exports = customDefaultsMerge;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(57),
    assignMergeValue = __webpack_require__(86),
    baseFor = __webpack_require__(87),
    baseMergeDeep = __webpack_require__(89),
    isObject = __webpack_require__(16),
    keysIn = __webpack_require__(102),
    safeGet = __webpack_require__(100);

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    if (isObject(srcValue)) {
      stack || (stack = new Stack);
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}

module.exports = baseMerge;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(58),
    stackClear = __webpack_require__(65),
    stackDelete = __webpack_require__(66),
    stackGet = __webpack_require__(67),
    stackHas = __webpack_require__(68),
    stackSet = __webpack_require__(69);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(59),
    listCacheDelete = __webpack_require__(60),
    listCacheGet = __webpack_require__(62),
    listCacheHas = __webpack_require__(63),
    listCacheSet = __webpack_require__(64);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),
/* 59 */
/***/ (function(module, exports) {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(61);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(21);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(61);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(61);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(61);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(58);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),
/* 66 */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),
/* 67 */
/***/ (function(module, exports) {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),
/* 68 */
/***/ (function(module, exports) {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(58),
    Map = __webpack_require__(70),
    MapCache = __webpack_require__(71);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(6),
    root = __webpack_require__(11);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(72),
    mapCacheDelete = __webpack_require__(80),
    mapCacheGet = __webpack_require__(83),
    mapCacheHas = __webpack_require__(84),
    mapCacheSet = __webpack_require__(85);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(73),
    ListCache = __webpack_require__(58),
    Map = __webpack_require__(70);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(74),
    hashDelete = __webpack_require__(76),
    hashGet = __webpack_require__(77),
    hashHas = __webpack_require__(78),
    hashSet = __webpack_require__(79);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(75);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(6);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),
/* 76 */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(75);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(75);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(75);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(81);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var isKeyable = __webpack_require__(82);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),
/* 82 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(81);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(81);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(81);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(4),
    eq = __webpack_require__(21);

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignMergeValue;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var createBaseFor = __webpack_require__(88);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;


/***/ }),
/* 88 */
/***/ (function(module, exports) {

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var assignMergeValue = __webpack_require__(86),
    cloneBuffer = __webpack_require__(90),
    cloneTypedArray = __webpack_require__(91),
    copyArray = __webpack_require__(94),
    initCloneObject = __webpack_require__(95),
    isArguments = __webpack_require__(40),
    isArray = __webpack_require__(43),
    isArrayLikeObject = __webpack_require__(98),
    isBuffer = __webpack_require__(44),
    isFunction = __webpack_require__(8),
    isObject = __webpack_require__(16),
    isPlainObject = __webpack_require__(99),
    isTypedArray = __webpack_require__(47),
    safeGet = __webpack_require__(100),
    toPlainObject = __webpack_require__(101);

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key),
      srcValue = safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || isFunction(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

module.exports = baseMergeDeep;


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(11);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(45)(module)))

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(92);

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var Uint8Array = __webpack_require__(93);

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(11);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),
/* 94 */
/***/ (function(module, exports) {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var baseCreate = __webpack_require__(96),
    getPrototype = __webpack_require__(97),
    isPrototype = __webpack_require__(36);

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(16);

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(53);

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(33),
    isObjectLike = __webpack_require__(42);

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(9),
    getPrototype = __webpack_require__(97),
    isObjectLike = __webpack_require__(42);

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;


/***/ }),
/* 100 */
/***/ (function(module, exports) {

/**
 * Gets the value at `key`, unless `key` is "__proto__".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key == '__proto__') {
    return;
  }

  return object[key];
}

module.exports = safeGet;


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(22),
    keysIn = __webpack_require__(102);

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

module.exports = toPlainObject;


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(38),
    baseKeysIn = __webpack_require__(103),
    isArrayLike = __webpack_require__(33);

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(16),
    isPrototype = __webpack_require__(36),
    nativeKeysIn = __webpack_require__(104);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;


/***/ }),
/* 104 */
/***/ (function(module, exports) {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var baseMerge = __webpack_require__(56),
    createAssigner = __webpack_require__(23);

/**
 * This method is like `_.merge` except that it accepts `customizer` which
 * is invoked to produce the merged values of the destination and source
 * properties. If `customizer` returns `undefined`, merging is handled by the
 * method instead. The `customizer` is invoked with six arguments:
 * (objValue, srcValue, key, object, source, stack).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   if (_.isArray(objValue)) {
 *     return objValue.concat(srcValue);
 *   }
 * }
 *
 * var object = { 'a': [1], 'b': [2] };
 * var other = { 'a': [3], 'b': [4] };
 *
 * _.mergeWith(object, other, customizer);
 * // => { 'a': [1, 3], 'b': [2, 4] }
 */
var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
  baseMerge(object, source, srcIndex, customizer);
});

module.exports = mergeWith;


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(107);

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(108),
    toKey = __webpack_require__(117);

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(43),
    isKey = __webpack_require__(109),
    stringToPath = __webpack_require__(111),
    toString = __webpack_require__(114);

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(43),
    isSymbol = __webpack_require__(110);

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(9),
    isObjectLike = __webpack_require__(42);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var memoizeCapped = __webpack_require__(112);

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var memoize = __webpack_require__(113);

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(71);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

var baseToString = __webpack_require__(115);

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(10),
    arrayMap = __webpack_require__(116),
    isArray = __webpack_require__(43),
    isSymbol = __webpack_require__(110);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),
/* 116 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(110);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var baseSet = __webpack_require__(119);

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

module.exports = set;


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(3),
    castPath = __webpack_require__(108),
    isIndex = __webpack_require__(35),
    isObject = __webpack_require__(16),
    toKey = __webpack_require__(117);

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

module.exports = baseSet;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var v1 = __webpack_require__(121);
var v4 = __webpack_require__(124);

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(122);
var bytesToUuid = __webpack_require__(123);

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),
/* 122 */
/***/ (function(module, exports) {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),
/* 123 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(122);
var bytesToUuid = __webpack_require__(123);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;var require;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (f) {
  if (( false ? undefined : _typeof(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (f),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var g; }
})(function () {
  var define, module, exports;
  return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return require(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }

          var p = n[i] = {
            exports: {}
          };
          e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];
            return o(n || r);
          }, p, p.exports, r, e, n, t);
        }

        return n[i].exports;
      }

      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
        o(t[i]);
      }

      return o;
    }

    return r;
  }()({
    1: [function (require, module, exports) {
      /**
       * Helpers.
       */
      var s = 1000;
      var m = s * 60;
      var h = m * 60;
      var d = h * 24;
      var w = d * 7;
      var y = d * 365.25;
      /**
       * Parse or format the given `val`.
       *
       * Options:
       *
       *  - `long` verbose formatting [false]
       *
       * @param {String|Number} val
       * @param {Object} [options]
       * @throws {Error} throw an error if val is not a non-empty string or a number
       * @return {String|Number}
       * @api public
       */

      module.exports = function (val, options) {
        options = options || {};

        var type = _typeof(val);

        if (type === 'string' && val.length > 0) {
          return parse(val);
        } else if (type === 'number' && isNaN(val) === false) {
          return options.long ? fmtLong(val) : fmtShort(val);
        }

        throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
      };
      /**
       * Parse the given `str` and return milliseconds.
       *
       * @param {String} str
       * @return {Number}
       * @api private
       */


      function parse(str) {
        str = String(str);

        if (str.length > 100) {
          return;
        }

        var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);

        if (!match) {
          return;
        }

        var n = parseFloat(match[1]);
        var type = (match[2] || 'ms').toLowerCase();

        switch (type) {
          case 'years':
          case 'year':
          case 'yrs':
          case 'yr':
          case 'y':
            return n * y;

          case 'weeks':
          case 'week':
          case 'w':
            return n * w;

          case 'days':
          case 'day':
          case 'd':
            return n * d;

          case 'hours':
          case 'hour':
          case 'hrs':
          case 'hr':
          case 'h':
            return n * h;

          case 'minutes':
          case 'minute':
          case 'mins':
          case 'min':
          case 'm':
            return n * m;

          case 'seconds':
          case 'second':
          case 'secs':
          case 'sec':
          case 's':
            return n * s;

          case 'milliseconds':
          case 'millisecond':
          case 'msecs':
          case 'msec':
          case 'ms':
            return n;

          default:
            return undefined;
        }
      }
      /**
       * Short format for `ms`.
       *
       * @param {Number} ms
       * @return {String}
       * @api private
       */


      function fmtShort(ms) {
        var msAbs = Math.abs(ms);

        if (msAbs >= d) {
          return Math.round(ms / d) + 'd';
        }

        if (msAbs >= h) {
          return Math.round(ms / h) + 'h';
        }

        if (msAbs >= m) {
          return Math.round(ms / m) + 'm';
        }

        if (msAbs >= s) {
          return Math.round(ms / s) + 's';
        }

        return ms + 'ms';
      }
      /**
       * Long format for `ms`.
       *
       * @param {Number} ms
       * @return {String}
       * @api private
       */


      function fmtLong(ms) {
        var msAbs = Math.abs(ms);

        if (msAbs >= d) {
          return plural(ms, msAbs, d, 'day');
        }

        if (msAbs >= h) {
          return plural(ms, msAbs, h, 'hour');
        }

        if (msAbs >= m) {
          return plural(ms, msAbs, m, 'minute');
        }

        if (msAbs >= s) {
          return plural(ms, msAbs, s, 'second');
        }

        return ms + ' ms';
      }
      /**
       * Pluralization helper.
       */


      function plural(ms, msAbs, n, name) {
        var isPlural = msAbs >= n * 1.5;
        return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
      }
    }, {}],
    2: [function (require, module, exports) {
      // shim for using process in browser
      var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
      // don't break things.  But we need to wrap it in a try catch in case it is
      // wrapped in strict mode code which doesn't define any globals.  It's inside a
      // function because try/catches deoptimize in certain engines.

      var cachedSetTimeout;
      var cachedClearTimeout;

      function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
      }

      function defaultClearTimeout() {
        throw new Error('clearTimeout has not been defined');
      }

      (function () {
        try {
          if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }

        try {
          if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      })();

      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
        } // if setTimeout wasn't available but was latter defined


        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }

        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
          }
        }
      }

      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
        } // if clearTimeout wasn't available but was latter defined


        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }

        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
          }
        }
      }

      var queue = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;

      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }

        draining = false;

        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }

        if (queue.length) {
          drainQueue();
        }
      }

      function drainQueue() {
        if (draining) {
          return;
        }

        var timeout = runTimeout(cleanUpNextTick);
        draining = true;
        var len = queue.length;

        while (len) {
          currentQueue = queue;
          queue = [];

          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }

          queueIndex = -1;
          len = queue.length;
        }

        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }

      process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);

        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }

        queue.push(new Item(fun, args));

        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      }; // v8 likes predictible objects


      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }

      Item.prototype.run = function () {
        this.fun.apply(null, this.array);
      };

      process.title = 'browser';
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = ''; // empty string to avoid regexp issues

      process.versions = {};

      function noop() {}

      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.prependListener = noop;
      process.prependOnceListener = noop;

      process.listeners = function (name) {
        return [];
      };

      process.binding = function (name) {
        throw new Error('process.binding is not supported');
      };

      process.cwd = function () {
        return '/';
      };

      process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
      };

      process.umask = function () {
        return 0;
      };
    }, {}],
    3: [function (require, module, exports) {
      /**
       * This is the common logic for both the Node.js and web browser
       * implementations of `debug()`.
       */
      function setup(env) {
        createDebug.debug = createDebug;
        createDebug.default = createDebug;
        createDebug.coerce = coerce;
        createDebug.disable = disable;
        createDebug.enable = enable;
        createDebug.enabled = enabled;
        createDebug.humanize = require('ms');
        Object.keys(env).forEach(function (key) {
          createDebug[key] = env[key];
        });
        /**
        * Active `debug` instances.
        */

        createDebug.instances = [];
        /**
        * The currently active debug mode names, and names to skip.
        */

        createDebug.names = [];
        createDebug.skips = [];
        /**
        * Map of special "%n" handling functions, for the debug "format" argument.
        *
        * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
        */

        createDebug.formatters = {};
        /**
        * Selects a color for a debug namespace
        * @param {String} namespace The namespace string for the for the debug instance to be colored
        * @return {Number|String} An ANSI color code for the given namespace
        * @api private
        */

        function selectColor(namespace) {
          var hash = 0;

          for (var i = 0; i < namespace.length; i++) {
            hash = (hash << 5) - hash + namespace.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
          }

          return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
        }

        createDebug.selectColor = selectColor;
        /**
        * Create a debugger with the given `namespace`.
        *
        * @param {String} namespace
        * @return {Function}
        * @api public
        */

        function createDebug(namespace) {
          var prevTime;

          function debug() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            // Disabled?
            if (!debug.enabled) {
              return;
            }

            var self = debug; // Set `diff` timestamp

            var curr = Number(new Date());
            var ms = curr - (prevTime || curr);
            self.diff = ms;
            self.prev = prevTime;
            self.curr = curr;
            prevTime = curr;
            args[0] = createDebug.coerce(args[0]);

            if (typeof args[0] !== 'string') {
              // Anything else let's inspect with %O
              args.unshift('%O');
            } // Apply any `formatters` transformations


            var index = 0;
            args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
              // If we encounter an escaped % then don't increase the array index
              if (match === '%%') {
                return match;
              }

              index++;
              var formatter = createDebug.formatters[format];

              if (typeof formatter === 'function') {
                var val = args[index];
                match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

                args.splice(index, 1);
                index--;
              }

              return match;
            }); // Apply env-specific formatting (colors, etc.)

            createDebug.formatArgs.call(self, args);
            var logFn = self.log || createDebug.log;
            logFn.apply(self, args);
          }

          debug.namespace = namespace;
          debug.enabled = createDebug.enabled(namespace);
          debug.useColors = createDebug.useColors();
          debug.color = selectColor(namespace);
          debug.destroy = destroy;
          debug.extend = extend; // Debug.formatArgs = formatArgs;
          // debug.rawLog = rawLog;
          // env-specific initialization logic for debug instances

          if (typeof createDebug.init === 'function') {
            createDebug.init(debug);
          }

          createDebug.instances.push(debug);
          return debug;
        }

        function destroy() {
          var index = createDebug.instances.indexOf(this);

          if (index !== -1) {
            createDebug.instances.splice(index, 1);
            return true;
          }

          return false;
        }

        function extend(namespace, delimiter) {
          var newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
          newDebug.log = this.log;
          return newDebug;
        }
        /**
        * Enables a debug mode by namespaces. This can include modes
        * separated by a colon and wildcards.
        *
        * @param {String} namespaces
        * @api public
        */


        function enable(namespaces) {
          createDebug.save(namespaces);
          createDebug.names = [];
          createDebug.skips = [];
          var i;
          var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
          var len = split.length;

          for (i = 0; i < len; i++) {
            if (!split[i]) {
              // ignore empty strings
              continue;
            }

            namespaces = split[i].replace(/\*/g, '.*?');

            if (namespaces[0] === '-') {
              createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
            } else {
              createDebug.names.push(new RegExp('^' + namespaces + '$'));
            }
          }

          for (i = 0; i < createDebug.instances.length; i++) {
            var instance = createDebug.instances[i];
            instance.enabled = createDebug.enabled(instance.namespace);
          }
        }
        /**
        * Disable debug output.
        *
        * @return {String} namespaces
        * @api public
        */


        function disable() {
          var namespaces = [].concat(_toConsumableArray(createDebug.names.map(toNamespace)), _toConsumableArray(createDebug.skips.map(toNamespace).map(function (namespace) {
            return '-' + namespace;
          }))).join(',');
          createDebug.enable('');
          return namespaces;
        }
        /**
        * Returns true if the given mode name is enabled, false otherwise.
        *
        * @param {String} name
        * @return {Boolean}
        * @api public
        */


        function enabled(name) {
          if (name[name.length - 1] === '*') {
            return true;
          }

          var i;
          var len;

          for (i = 0, len = createDebug.skips.length; i < len; i++) {
            if (createDebug.skips[i].test(name)) {
              return false;
            }
          }

          for (i = 0, len = createDebug.names.length; i < len; i++) {
            if (createDebug.names[i].test(name)) {
              return true;
            }
          }

          return false;
        }
        /**
        * Convert regexp to namespace
        *
        * @param {RegExp} regxep
        * @return {String} namespace
        * @api private
        */


        function toNamespace(regexp) {
          return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
        }
        /**
        * Coerce `val`.
        *
        * @param {Mixed} val
        * @return {Mixed}
        * @api private
        */


        function coerce(val) {
          if (val instanceof Error) {
            return val.stack || val.message;
          }

          return val;
        }

        createDebug.enable(createDebug.load());
        return createDebug;
      }

      module.exports = setup;
    }, {
      "ms": 1
    }],
    4: [function (require, module, exports) {
      (function (process) {
        /* eslint-env browser */

        /**
         * This is the web browser implementation of `debug()`.
         */
        exports.log = log;
        exports.formatArgs = formatArgs;
        exports.save = save;
        exports.load = load;
        exports.useColors = useColors;
        exports.storage = localstorage();
        /**
         * Colors.
         */

        exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
        /**
         * Currently only WebKit-based Web Inspectors, Firefox >= v31,
         * and the Firebug extension (any Firefox version) are known
         * to support "%c" CSS customizations.
         *
         * TODO: add a `localStorage` variable to explicitly enable/disable colors
         */
        // eslint-disable-next-line complexity

        function useColors() {
          // NB: In an Electron preload script, document will be defined but not fully
          // initialized. Since we know we're in Chrome, we'll just detect this case
          // explicitly
          if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
            return true;
          } // Internet Explorer and Edge do not support colors.


          if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
            return false;
          } // Is webkit? http://stackoverflow.com/a/16459606/376773
          // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


          return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
          typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
          // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
          typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
          typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
        }
        /**
         * Colorize log arguments if enabled.
         *
         * @api public
         */


        function formatArgs(args) {
          args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

          if (!this.useColors) {
            return;
          }

          var c = 'color: ' + this.color;
          args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
          // arguments passed either before or after the %c, so we need to
          // figure out the correct index to insert the CSS into

          var index = 0;
          var lastC = 0;
          args[0].replace(/%[a-zA-Z%]/g, function (match) {
            if (match === '%%') {
              return;
            }

            index++;

            if (match === '%c') {
              // We only are interested in the *last* %c
              // (the user may have provided their own)
              lastC = index;
            }
          });
          args.splice(lastC, 0, c);
        }
        /**
         * Invokes `console.log()` when available.
         * No-op when `console.log` is not a "function".
         *
         * @api public
         */


        function log() {
          var _console;

          // This hackery is required for IE8/9, where
          // the `console.log` function doesn't have 'apply'
          return (typeof console === "undefined" ? "undefined" : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);
        }
        /**
         * Save `namespaces`.
         *
         * @param {String} namespaces
         * @api private
         */


        function save(namespaces) {
          try {
            if (namespaces) {
              exports.storage.setItem('debug', namespaces);
            } else {
              exports.storage.removeItem('debug');
            }
          } catch (error) {// Swallow
            // XXX (@Qix-) should we be logging these?
          }
        }
        /**
         * Load `namespaces`.
         *
         * @return {String} returns the previously persisted debug modes
         * @api private
         */


        function load() {
          var r;

          try {
            r = exports.storage.getItem('debug');
          } catch (error) {} // Swallow
          // XXX (@Qix-) should we be logging these?
          // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


          if (!r && typeof process !== 'undefined' && 'env' in process) {
            r = process.env.DEBUG;
          }

          return r;
        }
        /**
         * Localstorage attempts to return the localstorage.
         *
         * This is necessary because safari throws
         * when a user disables cookies/localstorage
         * and you attempt to access it.
         *
         * @return {LocalStorage}
         * @api private
         */


        function localstorage() {
          try {
            // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
            // The Browser also has localStorage in the global context.
            return localStorage;
          } catch (error) {// Swallow
            // XXX (@Qix-) should we be logging these?
          }
        }

        module.exports = require('./common')(exports);
        var formatters = module.exports.formatters;
        /**
         * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
         */

        formatters.j = function (v) {
          try {
            return JSON.stringify(v);
          } catch (error) {
            return '[UnexpectedJSONParseError]: ' + error.message;
          }
        };
      }).call(this, require('_process'));
    }, {
      "./common": 3,
      "_process": 2
    }]
  }, {}, [4])(4);
});


/***/ }),
/* 126 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Providers", function() { return Providers; });
/* harmony import */ var _providers_auth0_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(127);
/* harmony import */ var _providers_azure_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(128);
/* harmony import */ var _providers_cognito_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(129);
/* harmony import */ var _providers_wso2_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(130);
/* harmony import */ var _providers_okta_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(131);
/* harmony import */ var _providers_keycloak_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(132);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }







/**
 * A collection of overrides for specific Identity Providers
 */

var Providers =
/*#__PURE__*/
function () {
  function Providers() {
    _classCallCheck(this, Providers);
  }

  _createClass(Providers, null, [{
    key: "auth0",

    /**
     * Provider for Auth0
     * @type {SalteAuthAuth0Provider}
     */
    get: function get() {
      return _providers_auth0_js__WEBPACK_IMPORTED_MODULE_0__["default"];
    }
    /**
     * Provider for Azure's Active Directory
     * @type {SalteAuthAzureProvider}
     */

  }, {
    key: "azure",
    get: function get() {
      return _providers_azure_js__WEBPACK_IMPORTED_MODULE_1__["default"];
    }
    /**
     * Provider for Amazon's Cognito
     * @type {SalteAuthCognitoProvider}
     */

  }, {
    key: "cognito",
    get: function get() {
      return _providers_cognito_js__WEBPACK_IMPORTED_MODULE_2__["default"];
    }
    /**
     * Provider for WSO2's API Gateway
     * @type {SalteAuthWSO2Provider}
     */

  }, {
    key: "wso2",
    get: function get() {
      return _providers_wso2_js__WEBPACK_IMPORTED_MODULE_3__["default"];
    }
    /**
     * Provider for Okta
     * @type {SalteAuthOktaProvider}
     */

  }, {
    key: "okta",
    get: function get() {
      return _providers_okta_js__WEBPACK_IMPORTED_MODULE_4__["default"];
    }
    /**
     * Provider for Keycloak
     * @type {SalteAuthKeycloakProvider}
     */

  }, {
    key: "keycloak",
    get: function get() {
      return _providers_keycloak_js__WEBPACK_IMPORTED_MODULE_5__["default"];
    }
  }]);

  return Providers;
}();

;

/* harmony default export */ __webpack_exports__["default"] = (Providers);

/***/ }),
/* 127 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Provider for Auth0
 * @see https://auth0.com
 */
var SalteAuthAuth0Provider =
/*#__PURE__*/
function () {
  function SalteAuthAuth0Provider() {
    _classCallCheck(this, SalteAuthAuth0Provider);
  }

  _createClass(SalteAuthAuth0Provider, null, [{
    key: "deauthorizeUrl",

    /**
     * Computes the deauthorization url
     * @param {Config} config configuration for salte auth
     * @return {String} the deauthorization url
     */
    value: function deauthorizeUrl(config) {
      return this.$utilities.createUrl("".concat(config.providerUrl, "/v2/logout"), {
        returnTo: config.redirectUrl && config.redirectUrl.logoutUrl || config.redirectUrl,
        client_id: config.clientId
      });
    }
  }]);

  return SalteAuthAuth0Provider;
}();

/* harmony default export */ __webpack_exports__["default"] = (SalteAuthAuth0Provider);

/***/ }),
/* 128 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/** Provider for Azure's Active Directory */
var SalteAuthAzureProvider =
/*#__PURE__*/
function () {
  function SalteAuthAzureProvider() {
    _classCallCheck(this, SalteAuthAzureProvider);
  }

  _createClass(SalteAuthAzureProvider, null, [{
    key: "authorizeEndpoint",

    /**
     * Computes the authorization endpoint
     * @param {Config} config configuration for salte auth
     * @return {String} the authorization endpoint
     */
    value: function authorizeEndpoint(config) {
      return "".concat(config.providerUrl, "/oauth2/authorize");
    }
    /**
     * Computes the deauthorization url
     * @param {Config} config configuration for salte auth
     * @return {String} the deauthorization url
     */

  }, {
    key: "deauthorizeUrl",
    value: function deauthorizeUrl(config) {
      return this.$utilities.createUrl("".concat(config.providerUrl, "/oauth2/logout"), {
        post_logout_redirect_uri: config.redirectUrl && config.redirectUrl.logoutUrl || config.redirectUrl
      });
    }
  }]);

  return SalteAuthAzureProvider;
}();

/* harmony default export */ __webpack_exports__["default"] = (SalteAuthAzureProvider);

/***/ }),
/* 129 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/** Provider for Amazon's Cognito */
var SalteAuthCognitoProvider =
/*#__PURE__*/
function () {
  function SalteAuthCognitoProvider() {
    _classCallCheck(this, SalteAuthCognitoProvider);
  }

  _createClass(SalteAuthCognitoProvider, null, [{
    key: "authorizeEndpoint",

    /**
     * Computes the authorization endpoint
     * @param {Config} config configuration for salte auth
     * @return {String} the authorization endpoint
     */
    value: function authorizeEndpoint(config) {
      return "".concat(config.providerUrl, "/oauth2/authorize");
    }
    /**
     * Computes the deauthorization url
     * @param {Config} config configuration for salte auth
     * @return {String} the deauthorization url
     */

  }, {
    key: "deauthorizeUrl",
    value: function deauthorizeUrl(config) {
      return this.$utilities.createUrl("".concat(config.providerUrl, "/logout"), {
        logout_uri: config.redirectUrl && config.redirectUrl.logoutUrl || config.redirectUrl,
        client_id: config.clientId
      });
    }
    /**
     * Provides a set of default config options required for cognito
     */

  }, {
    key: "defaultConfig",
    get: function get() {
      return {
        validation: {
          // Amazon Cognito doesn't support nonce validation
          nonce: false
        }
      };
    }
  }]);

  return SalteAuthCognitoProvider;
}();

/* harmony default export */ __webpack_exports__["default"] = (SalteAuthCognitoProvider);

/***/ }),
/* 130 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/** Provider for WSO2's API Gateway */
var SalteAuthWSO2Provider =
/*#__PURE__*/
function () {
  function SalteAuthWSO2Provider() {
    _classCallCheck(this, SalteAuthWSO2Provider);
  }

  _createClass(SalteAuthWSO2Provider, null, [{
    key: "deauthorizeUrl",

    /**
     * Computes the deauthorization url
     * @param {Config} config configuration for salte auth
     * @return {String} the deauthorization url
     */
    value: function deauthorizeUrl(config) {
      return this.$utilities.createUrl("".concat(config.providerUrl, "/commonauth"), {
        commonAuthLogout: true,
        type: 'oidc',
        commonAuthCallerPath: config.redirectUrl && config.redirectUrl.logoutUrl || config.redirectUrl,
        relyingParty: config.relyingParty
      });
    }
  }]);

  return SalteAuthWSO2Provider;
}();

/* harmony default export */ __webpack_exports__["default"] = (SalteAuthWSO2Provider);

/***/ }),
/* 131 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/** Provider for Okta */
var SalteAuthOktaProvider =
/*#__PURE__*/
function () {
  function SalteAuthOktaProvider() {
    _classCallCheck(this, SalteAuthOktaProvider);
  }

  _createClass(SalteAuthOktaProvider, null, [{
    key: "authorizeEndpoint",

    /**
     * Computes the authorization endpoint
     * @param {Config} config configuration for salte auth
     * @return {String} the authorization endpoint
     */
    value: function authorizeEndpoint(config) {
      return "".concat(config.providerUrl, "/oauth2/v1/authorize");
    }
    /**
     * Computes the deauthorization url
     * @param {Config} config configuration for salte auth
     * @return {String} the deauthorization url
     */

  }, {
    key: "deauthorizeUrl",
    value: function deauthorizeUrl(config) {
      return this.$utilities.createUrl("".concat(config.providerUrl, "/oauth2/v1/logout"), {
        id_token_hint: config.idToken,
        post_logout_redirect_uri: config.redirectUrl && config.redirectUrl.logoutUrl || config.redirectUrl
      });
    }
  }]);

  return SalteAuthOktaProvider;
}();

/* harmony default export */ __webpack_exports__["default"] = (SalteAuthOktaProvider);

/***/ }),
/* 132 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Provider for Keycloak.
 * Keycloak is an open source identity and access management solution.
 * @see https://www.keycloak.org/
 */
var SalteAuthKeycloakProvider =
/*#__PURE__*/
function () {
  function SalteAuthKeycloakProvider() {
    _classCallCheck(this, SalteAuthKeycloakProvider);
  }

  _createClass(SalteAuthKeycloakProvider, null, [{
    key: "authorizeEndpoint",

    /**
     * Computes the authorization endpoint
     * @param {Config} config configuration for salte auth
     * @return {String} the authorization endpoint
     */
    value: function authorizeEndpoint(config) {
      return "".concat(config.providerUrl, "/protocol/openid-connect/auth");
    }
    /**
     * Computes the deauthorization url
     * @param {Config} config configuration for salte auth
     * @return {String} the deauthorization url
     */

  }, {
    key: "deauthorizeUrl",
    value: function deauthorizeUrl(config) {
      return this.$utilities.createUrl("".concat(config.providerUrl, "/protocol/openid-connect/logout"), {
        redirect_uri: config.redirectUrl && config.redirectUrl.logoutUrl || config.redirectUrl,
        client_id: config.clientId
      });
    }
  }]);

  return SalteAuthKeycloakProvider;
}();

/* harmony default export */ __webpack_exports__["default"] = (SalteAuthKeycloakProvider);

/***/ }),
/* 133 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalteAuthProfile", function() { return SalteAuthProfile; });
/* harmony import */ var lodash_defaultsDeep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54);
/* harmony import */ var lodash_defaultsDeep__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_defaultsDeep__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_find__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(134);
/* harmony import */ var lodash_find__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_find__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(125);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_2__);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




/** @ignore */

var logger = debug__WEBPACK_IMPORTED_MODULE_2___default()('@salte-auth/salte-auth:profile');
/**
 * All the profile information associated with the current authentication session
 */

var SalteAuthProfile =
/*#__PURE__*/
function () {
  /**
   * Parses the current url for the authentication values
   * @param {Config} config configuration for salte auth
   */
  function SalteAuthProfile(config) {
    _classCallCheck(this, SalteAuthProfile);

    logger('Appending defaults to config...');
    /** @ignore */

    this.$$config = lodash_defaultsDeep__WEBPACK_IMPORTED_MODULE_0___default()(config, {
      validation: {
        nonce: true,
        state: true,
        azp: true,
        aud: true
      },
      storageType: 'session'
    });
    /**
     * The parsed user information from the id token
     * @type {Object}
     */

    this.userInfo = null;
    this.$refreshUserInfo();
  }
  /**
   * Checks for a hash / query params, parses it, and removes it.
   */


  _createClass(SalteAuthProfile, [{
    key: "$parseParams",
    value: function $parseParams() {
      if (location.search || location.hash) {
        var params = location.search.replace(/^\?/, '').split('&').concat(location.hash.replace(/(#!?[^#]+)?#/, '').split('&'));
        logger("Hash detected, parsing...", params);

        for (var i = 0; i < params.length; i++) {
          var param = params[i];

          var _param$split = param.split('='),
              _param$split2 = _slicedToArray(_param$split, 2),
              key = _param$split2[0],
              value = _param$split2[1];

          this.$parse(key, decodeURIComponent(value));
        }

        logger("Removing hash...");
        history.pushState('', document.title, location.href.replace(location.search, '').replace(location.hash, ''));
      }
    }
    /**
     * Parse a key-value pair
     * @param {String} key the key to parse
     * @param {Object} value the matching value to parse
     * @private
     */

  }, {
    key: "$parse",
    value: function $parse(key, value) {
      switch (key) {
        case 'token_type':
          this.$tokenType = value;
          break;

        case 'expires_in':
          this.$expiration = Date.now() + Number(value) * 1000;
          break;

        case 'access_token':
          this.$accessToken = value;
          break;

        case 'id_token':
          this.$idToken = value;
          break;

        case 'code':
          this.code = value;
          break;

        case 'state':
          this.$state = value;
          break;

        case 'error':
          this.$error = value;
          break;

        case 'error_description':
          this.$errorDescription = value;
          break;

        case 'scope':
          this.$scope = value;
      }
    }
    /**
     * Whether the ID Token has expired
     * @return {Boolean} true if the "id_token" has expired
     */

  }, {
    key: "$actions",

    /**
     * Sets or Gets an action based on whether a action was passed.
     * @param {String} state The state this action is tied to.
     * @param {String} action The action to store.
     * @return {String|undefined} Returns a string if an action wasn't provided.
     * @private
     */
    value: function $actions(state, action) {
      if (action) {
        this.$saveItem("salte.auth.action.".concat(state), action);
      } else {
        return this.$getItem("salte.auth.action.".concat(state));
      }
    }
    /**
     * Parses the User Info from the ID Token
     * @param {String} idToken the id token to update based off
     * @private
     */

  }, {
    key: "$refreshUserInfo",
    value: function $refreshUserInfo() {
      var idToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.$idToken;
      var userInfo = null;

      if (idToken) {
        var separatedToken = idToken.split('.');

        if (separatedToken.length === 3) {
          // This fixes an issue where various providers will encode values
          // incorrectly and cause the browser to fail to decode.
          // https://stackoverflow.com/questions/43065553/base64-decoded-differently-in-java-jjwt
          var payload = separatedToken[1].replace(/-/g, '+').replace(/_/g, '/');
          userInfo = JSON.parse(atob(payload));
        }
      }

      this.userInfo = userInfo;
    }
    /**
     * Verifies that we were logged in successfully and that all security checks pass
     * @param {Boolean} accessTokenRequest if the request we're validating was an access token request
     * @return {Object} the error message
     * @private
     */

  }, {
    key: "$validate",
    value: function $validate(accessTokenRequest) {
      var _this = this;

      this.$refreshUserInfo();

      if (!this.$$config.validation) {
        logger('Validation is disabled, skipping...');
        return;
      }

      if (this.$error) {
        return {
          code: this.$error,
          description: this.$errorDescription
        };
      }

      if (this.$$config.responseType === 'code' && !this.code || this.$$config.responseType !== 'code' && !this.$idToken) {
        return {
          code: 'login_canceled',
          description: 'User likely canceled the login or something unexpected occurred.'
        };
      }

      if (this.$$config.validation.state && this.$localState !== this.$state) {
        return {
          code: 'invalid_state',
          description: 'State provided by identity provider did not match local state.'
        };
      }

      if (this.$$config.responseType === 'code' || accessTokenRequest) return;

      if (this.$$config.validation.nonce && this.$nonce !== this.userInfo.nonce) {
        return {
          code: 'invalid_nonce',
          description: 'Nonce provided by identity provider did not match local nonce.'
        };
      }

      if (Array.isArray(this.userInfo.aud)) {
        if (this.$$config.validation.azp) {
          if (!this.userInfo.azp) {
            return {
              code: 'invalid_azp',
              description: 'Audience was returned as an array and AZP was not present on the ID Token.'
            };
          }

          if (this.userInfo.azp !== this.$$config.clientId) {
            return {
              code: 'invalid_azp',
              description: 'AZP does not match the Client ID.'
            };
          }
        }

        if (this.$$config.validation.aud) {
          var aud = lodash_find__WEBPACK_IMPORTED_MODULE_1___default()(this.userInfo.aud, function (audience) {
            return audience === _this.$$config.clientId;
          });

          if (!aud) {
            return {
              code: 'invalid_aud',
              description: 'None of the audience values matched the Client ID.'
            };
          }
        }
      } else if (this.$$config.validation.aud && this.userInfo.aud !== this.$$config.clientId) {
        return {
          code: 'invalid_aud',
          description: 'The audience did not match the Client ID.'
        };
      }
    }
    /**
     * Saves a value to the Web Storage API
     * @param {String} key The key to save to
     * @param {String} overrideStorageType the name of the storageType to use
     * @return {*} the storage value for the given key
     * @private
     */

  }, {
    key: "$getItem",
    value: function $getItem(key, overrideStorageType) {
      var storage = overrideStorageType ? this.$$getStorage(overrideStorageType) : this.$storage;
      return storage.getItem(key);
    }
    /**
     * Saves a value to the Web Storage API
     * @param {String} key The key to save to
     * @param {*} value The value to save, if this is undefined or null it will delete the key
     * @param {String} overrideStorageType the name of the storageType to use
     * @private
     */

  }, {
    key: "$saveItem",
    value: function $saveItem(key, value, overrideStorageType) {
      var storage = overrideStorageType ? this.$$getStorage(overrideStorageType) : this.$storage;

      if ([undefined, null].indexOf(value) !== -1) {
        storage.removeItem(key);
      } else {
        storage.setItem(key, value);
      }
    }
    /**
     * Return the active Web Storage API
     * @return {Storage} the storage api to save and pull values from
     * @private
     */

  }, {
    key: "$$getStorage",

    /**
     * Determines which Web Storage API to return using the name provided
     * @param {String} storageType the name of the storageType to use
     * @return {Storage} the web storage api that matches the given string
     * @ignore
     */
    value: function $$getStorage(storageType) {
      if (storageType === 'local') {
        return localStorage;
      } else if (storageType === 'session') {
        return sessionStorage;
      } else {
        throw new ReferenceError("Unknown Storage Type (".concat(storageType, ")"));
      }
    }
    /**
     * Clears all `salte.auth` values from localStorage
     * @private
     */

  }, {
    key: "$clear",
    value: function $clear() {
      for (var key in localStorage) {
        if (key.match(/^salte\.auth\.[^$]/)) {
          localStorage.removeItem(key);
        }
      }

      for (var _key in sessionStorage) {
        if (_key.match(/^salte\.auth\.[^$]/)) {
          sessionStorage.removeItem(_key);
        }
      }

      this.$refreshUserInfo();
    }
    /**
     * Clears all `salte.auth` error values from localStorage
     * @private
     */

  }, {
    key: "$clearErrors",
    value: function $clearErrors() {
      this.$error = undefined;
      this.$errorDescription = undefined;
    }
  }, {
    key: "idTokenExpired",
    get: function get() {
      return !this.$idToken || Date.now() >= this.userInfo.exp * 1000;
    }
    /**
     * Whether the Access Token has expired
     * @return {Boolean} true if the "access_token" has expired
     */

  }, {
    key: "accessTokenExpired",
    get: function get() {
      return !this.$accessToken || Date.now() >= this.$expiration;
    }
    /**
     * The type of Access Token that was returned by the identity provider
     * @return {String} the type of access token
     * @private
     */

  }, {
    key: "$tokenType",
    get: function get() {
      return this.$getItem('salte.auth.$token-type', 'session');
    },
    set: function set(tokenType) {
      this.$saveItem('salte.auth.$token-type', tokenType, 'session');
    }
    /**
     * The date and time that the access token will expire
     * @return {Number} the expiration time as unix timestamp
     * @private
     */

  }, {
    key: "$expiration",
    get: function get() {
      var expiration = this.$getItem('salte.auth.expiration');
      return expiration ? Number(expiration) : null;
    },
    set: function set(expiration) {
      this.$saveItem('salte.auth.expiration', expiration);
    }
    /**
     * The Access Token returned by the identity provider
     * @return {String} the access token
     * @private
     */

  }, {
    key: "$accessToken",
    get: function get() {
      return this.$getItem('salte.auth.access-token');
    },
    set: function set(accessToken) {
      this.$saveItem('salte.auth.access-token', accessToken);
    }
    /**
     * The ID Token returned by the identity provider
     * @return {String} the id token
     * @private
     */

  }, {
    key: "$idToken",
    get: function get() {
      return this.$getItem('salte.auth.id-token');
    },
    set: function set(idToken) {
      this.$saveItem('salte.auth.id-token', idToken);
    }
    /**
     * The Authorization Code returned by the identity provider
     * @return {String} the authorization code
     * @private
     */

  }, {
    key: "code",
    get: function get() {
      return this.$getItem('salte.auth.code');
    },
    set: function set(code) {
      this.$saveItem('salte.auth.code', code);
    }
    /**
     * The authentication state returned by the identity provider
     * @return {String} the state value
     * @private
     *
     * @see https://tools.ietf.org/html/rfc6749#section-4.1.1
     */

  }, {
    key: "$state",
    get: function get() {
      return this.$getItem('salte.auth.$state', 'session');
    },
    set: function set(state) {
      this.$saveItem('salte.auth.$state', state, 'session');
    }
    /**
     * The locally generate authentication state
     * @return {String} the local state value
     * @private
     *
     * @see https://tools.ietf.org/html/rfc6749#section-4.1.1
     */

  }, {
    key: "$localState",
    get: function get() {
      return this.$getItem('salte.auth.$local-state', 'session');
    },
    set: function set(localState) {
      this.$saveItem('salte.auth.$local-state', localState, 'session');
    }
    /**
     * The error returned by the identity provider
     * @return {String} the state value
     * @private
     */

  }, {
    key: "$error",
    get: function get() {
      return this.$getItem('salte.auth.error');
    },
    set: function set(error) {
      this.$saveItem('salte.auth.error', error);
    }
    /**
     * The error description returned by the identity provider
     * @return {String} a string that describes the error that occurred
     * @private
     */

  }, {
    key: "$errorDescription",
    get: function get() {
      return this.$getItem('salte.auth.error-description');
    },
    set: function set(errorDescription) {
      this.$saveItem('salte.auth.error-description', errorDescription);
    }
    /**
     * The scope returned by the identity provider
     * @return {String} The scope
     * @private
     */

  }, {
    key: "$scope",
    get: function get() {
      return this.$getItem('salte.auth.scope');
    },
    set: function set(scope) {
      this.$saveItem('salte.auth.scope', scope);
    }
    /**
     * The url the user originated from before authentication occurred
     * @return {String} The url the user originated from before authentication occurred
     * @private
     */

  }, {
    key: "$redirectUrl",
    get: function get() {
      return this.$getItem('salte.auth.$redirect-url', 'session');
    },
    set: function set(redirectUrl) {
      this.$saveItem('salte.auth.$redirect-url', redirectUrl, 'session');
    }
    /**
     * Parses the User Info from the ID Token
     * @return {String} The User Info from the ID Token
     * @private
     */

  }, {
    key: "$nonce",
    get: function get() {
      return this.$getItem('salte.auth.$nonce', 'session');
    },
    set: function set(nonce) {
      this.$saveItem('salte.auth.$nonce', nonce, 'session');
    }
  }, {
    key: "$storage",
    get: function get() {
      return this.$$getStorage(this.$$config.storageType);
    }
  }]);

  return SalteAuthProfile;
}();


/* harmony default export */ __webpack_exports__["default"] = (SalteAuthProfile);

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

var createFind = __webpack_require__(135),
    findIndex = __webpack_require__(172);

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = createFind(findIndex);

module.exports = find;


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var baseIteratee = __webpack_require__(136),
    isArrayLike = __webpack_require__(33),
    keys = __webpack_require__(37);

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike(collection)) {
      var iteratee = baseIteratee(predicate, 3);
      collection = keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

module.exports = createFind;


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var baseMatches = __webpack_require__(137),
    baseMatchesProperty = __webpack_require__(165),
    identity = __webpack_require__(25),
    isArray = __webpack_require__(43),
    property = __webpack_require__(169);

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsMatch = __webpack_require__(138),
    getMatchData = __webpack_require__(162),
    matchesStrictComparable = __webpack_require__(164);

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(57),
    baseIsEqual = __webpack_require__(139);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqualDeep = __webpack_require__(140),
    isObjectLike = __webpack_require__(42);

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(57),
    equalArrays = __webpack_require__(141),
    equalByTag = __webpack_require__(147),
    equalObjects = __webpack_require__(150),
    getTag = __webpack_require__(157),
    isArray = __webpack_require__(43),
    isBuffer = __webpack_require__(44),
    isTypedArray = __webpack_require__(47);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(142),
    arraySome = __webpack_require__(145),
    cacheHas = __webpack_require__(146);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(71),
    setCacheAdd = __webpack_require__(143),
    setCacheHas = __webpack_require__(144);

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ }),
/* 143 */
/***/ (function(module, exports) {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ }),
/* 144 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ }),
/* 145 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;


/***/ }),
/* 146 */
/***/ (function(module, exports) {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(10),
    Uint8Array = __webpack_require__(93),
    eq = __webpack_require__(21),
    equalArrays = __webpack_require__(141),
    mapToArray = __webpack_require__(148),
    setToArray = __webpack_require__(149);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;


/***/ }),
/* 148 */
/***/ (function(module, exports) {

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;


/***/ }),
/* 149 */
/***/ (function(module, exports) {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

var getAllKeys = __webpack_require__(151);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(152),
    getSymbols = __webpack_require__(154),
    keys = __webpack_require__(37);

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(153),
    isArray = __webpack_require__(43);

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),
/* 153 */
/***/ (function(module, exports) {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(155),
    stubArray = __webpack_require__(156);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),
/* 155 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),
/* 156 */
/***/ (function(module, exports) {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

var DataView = __webpack_require__(158),
    Map = __webpack_require__(70),
    Promise = __webpack_require__(159),
    Set = __webpack_require__(160),
    WeakMap = __webpack_require__(161),
    baseGetTag = __webpack_require__(9),
    toSource = __webpack_require__(19);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(6),
    root = __webpack_require__(11);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(6),
    root = __webpack_require__(11);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(6),
    root = __webpack_require__(11);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(6),
    root = __webpack_require__(11);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

var isStrictComparable = __webpack_require__(163),
    keys = __webpack_require__(37);

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(16);

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;


/***/ }),
/* 164 */
/***/ (function(module, exports) {

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqual = __webpack_require__(139),
    get = __webpack_require__(106),
    hasIn = __webpack_require__(166),
    isKey = __webpack_require__(109),
    isStrictComparable = __webpack_require__(163),
    matchesStrictComparable = __webpack_require__(164),
    toKey = __webpack_require__(117);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

var baseHasIn = __webpack_require__(167),
    hasPath = __webpack_require__(168);

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;


/***/ }),
/* 167 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(108),
    isArguments = __webpack_require__(40),
    isArray = __webpack_require__(43),
    isIndex = __webpack_require__(35),
    isLength = __webpack_require__(34),
    toKey = __webpack_require__(117);

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

var baseProperty = __webpack_require__(170),
    basePropertyDeep = __webpack_require__(171),
    isKey = __webpack_require__(109),
    toKey = __webpack_require__(117);

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;


/***/ }),
/* 170 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(107);

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(173),
    baseIteratee = __webpack_require__(136),
    toInteger = __webpack_require__(174);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

module.exports = findIndex;


/***/ }),
/* 173 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

var toFinite = __webpack_require__(175);

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

var toNumber = __webpack_require__(176);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(16),
    isSymbol = __webpack_require__(110);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),
/* 177 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalteAuthUtilities", function() { return SalteAuthUtilities; });
/* harmony import */ var lodash_assign__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var lodash_assign__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_assign__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(125);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_1__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



/** @ignore */

var logger = debug__WEBPACK_IMPORTED_MODULE_1___default()('@salte-auth/salte-auth:utilities');
/**
 * Basic utilities to support the authentication flow
 */

var SalteAuthUtilities =
/*#__PURE__*/
function () {
  /**
   * Wraps all XHR and Fetch (if available) requests to allow promise interceptors
   * @param {Config} config configuration for salte auth
   */
  function SalteAuthUtilities(config) {
    _classCallCheck(this, SalteAuthUtilities);

    /** @ignore */
    this.$$config = config;
    /** @ignore */

    this.$interceptors = {
      fetch: [],
      xhr: []
    };
    logger('Setting up wrappers for XMLHttpRequest...');

    (function (open) {
      XMLHttpRequest.prototype.open = function (method, url) {
        /** @ignore */
        this.$url = url;
        return open.call(this, method, url);
      };
    })(XMLHttpRequest.prototype.open);

    var self = this;

    (function (send) {
      XMLHttpRequest.prototype.send = function (data) {
        var _this = this;

        var promises = [];

        for (var i = 0; i < self.$interceptors.xhr.length; i++) {
          var interceptor = self.$interceptors.xhr[i];
          promises.push(interceptor(this, data));
        }

        Promise.all(promises).then(function () {
          send.call(_this, data);
        }).catch(function (error) {
          var event = document.createEvent('Event');
          event.initEvent('error', false, true);
          event.detail = error;

          _this.dispatchEvent(event);
        });
      };
    })(XMLHttpRequest.prototype.send);

    if (window.fetch) {
      logger('Fetch detected, setting up wrappers...');

      (function (fetch) {
        window.fetch = function (input, options) {
          var _this2 = this;

          var request = input instanceof Request ? input : new Request(input, options);
          var promises = [];

          for (var i = 0; i < self.$interceptors.fetch.length; i++) {
            var interceptor = self.$interceptors.fetch[i];
            promises.push(interceptor(request));
          }

          return Promise.all(promises).then(function () {
            return fetch.call(_this2, request);
          });
        };
      })(fetch);
    }
  }
  /**
   * Creates a URL using a base url and a queryParams object
   * @param {String} baseUrl the base url to attach the queryParams to
   * @param {Object} queryParams the queryParams to attach to the baseUrl
   * @return {String} the url with the request queryParams
   */


  _createClass(SalteAuthUtilities, [{
    key: "createUrl",
    value: function createUrl(baseUrl) {
      var queryParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var url = baseUrl;
      Object.keys(queryParams).forEach(function (key) {
        var value = queryParams[key];

        if ([undefined, null, ''].indexOf(value) === -1) {
          url += "".concat(url.indexOf('?') === -1 ? '?' : '&').concat(key, "=").concat(encodeURIComponent(value));
        }
      });
      return url;
    }
    /**
     * Converts a url to an absolute url
     * @param {String} path the url path to resolve to an absolute url
     * @return {String} the absolutely resolved url
     */

  }, {
    key: "resolveUrl",
    value: function resolveUrl(path) {
      if (!this.$$urlDocument) {
        /** @ignore */
        this.$$urlDocument = document.implementation.createHTMLDocument('url');
        /** @ignore */

        this.$$urlBase = this.$$urlDocument.createElement('base');
        /** @ignore */

        this.$$urlAnchor = this.$$urlDocument.createElement('a');
        this.$$urlDocument.head.appendChild(this.$$urlBase);
      }

      this.$$urlBase.href = window.location.protocol + '//' + window.location.host;
      this.$$urlAnchor.href = path.replace(/ /g, '%20');
      return this.$$urlAnchor.href.replace(/\/$/, '');
    }
    /**
     * Checks if the given url matches any of the test urls
     * @param {String} url The url to test
     * @param {Array<String|RegExp>} tests The urls to match the test url against
     * @return {Boolean} true if the url matches one of the tests
     */

  }, {
    key: "checkForMatchingUrl",
    value: function checkForMatchingUrl(url) {
      var tests = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var resolvedUrl = this.resolveUrl(url);

      for (var i = 0; i < tests.length; i++) {
        var test = tests[i];

        if (test instanceof RegExp) {
          if (resolvedUrl.match(test)) return true;
        } else {
          if (resolvedUrl.indexOf(this.resolveUrl(test)) === 0) return true;
        }
      }

      return false;
    }
    /**
     * Determines if the given route is a secured route
     * @param {String} route the route to verify
     * @param {Boolean|Array<String>} securedRoutes a list of routes that require authentication
     * @return {Boolean} true if the route provided is a secured route
     */

  }, {
    key: "isRouteSecure",
    value: function isRouteSecure(route, securedRoutes) {
      if (securedRoutes === true) {
        return true;
      } else if (securedRoutes instanceof Array) {
        return this.checkForMatchingUrl(route, securedRoutes);
      }

      return false;
    }
    /**
     * Opens a popup window in the middle of the viewport
     * @param {String} url the url to be loaded
     * @param {String} name the name of the window
     * @param {Number} height the height of the window
     * @param {Number} width the width of the window
     * @return {Promise} resolves when the popup is closed
     */

  }, {
    key: "openPopup",
    value: function openPopup(url) {
      var _this3 = this;

      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'salte-auth';
      var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 600;
      var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 400;
      var top = window.innerHeight / 2 - height / 2 + window.screenTop;
      var left = window.innerWidth / 2 - width / 2 + window.screenLeft;
      var popupWindow = window.open(url, name, "height=".concat(height, ", width=").concat(width, ", status=yes, toolbar=no, menubar=no, location=no, top=").concat(top, ", left=").concat(left));

      if (!popupWindow) {
        return Promise.reject(new ReferenceError('We were unable to open the popup window, its likely that the request was blocked.'));
      }

      popupWindow.focus(); // TODO: Find a better way of tracking when a Window closes.

      return new Promise(function (resolve) {
        var checker = setInterval(function () {
          try {
            if (!popupWindow.closed) {
              // This could throw cross-domain errors, so we need to silence them.
              var loginUrl = _this3.$$config.redirectUrl && _this3.$$config.redirectUrl.loginUrl || _this3.$$config.redirectUrl;
              var logoutUrl = _this3.$$config.redirectUrl && _this3.$$config.redirectUrl.logoutUrl || _this3.$$config.redirectUrl;
              if (popupWindow.location.href.indexOf(loginUrl) !== 0 || popupWindow.location.href.indexOf(logoutUrl) !== 0) return;
              location.hash = popupWindow.location.hash;
              popupWindow.close();
            }

            clearInterval(checker);
            setTimeout(resolve);
          } catch (e) {}
        }, 100);
      });
    }
    /**
     * Opens a new tab
     * @param {String} url the url to be loaded
     * @return {Promise} resolves when the tab is closed
     */

  }, {
    key: "openNewTab",
    value: function openNewTab(url) {
      var _this4 = this;

      var tabWindow = window.open(url, '_blank');

      if (!tabWindow) {
        return Promise.reject(new ReferenceError('We were unable to open the new tab, its likely that the request was blocked.'));
      }

      tabWindow.name = 'salte-auth';
      tabWindow.focus(); // TODO: Find a better way of tracking when a Window closes.

      return new Promise(function (resolve) {
        var checker = setInterval(function () {
          try {
            if (!tabWindow.closed) {
              // This could throw cross-domain errors, so we need to silence them.
              var loginUrl = _this4.$$config.redirectUrl && _this4.$$config.redirectUrl.loginUrl || _this4.$$config.redirectUrl;
              var logoutUrl = _this4.$$config.redirectUrl && _this4.$$config.redirectUrl.logoutUrl || _this4.$$config.redirectUrl;
              if (tabWindow.location.href.indexOf(loginUrl) !== 0 || tabWindow.location.href.indexOf(logoutUrl) !== 0) return;
              location.hash = tabWindow.location.hash;
              tabWindow.close();
            }

            clearInterval(checker);
            setTimeout(resolve);
          } catch (e) {}
        }, 100);
      });
    }
    /**
     * Opens an iframe in the background
     * @param {String} url the url to be loaded
     * @param {Boolean} show whether the iframe should be visible
     * @return {Promise} resolves when the iframe is closed
     */

  }, {
    key: "createIframe",
    value: function createIframe(url, show) {
      var iframe = document.createElement('iframe');
      iframe.setAttribute('owner', 'salte-auth');

      if (show) {
        lodash_assign__WEBPACK_IMPORTED_MODULE_0___default()(iframe.style, {
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          height: '100%',
          width: '100%',
          zIndex: 9999,
          border: 'none',
          opacity: 0,
          transition: '0.5s opacity'
        });
        setTimeout(function () {
          iframe.style.opacity = 1;
        });
      } else {
        iframe.style.display = 'none';
      }

      iframe.src = url;
      document.body.appendChild(iframe);
      return new Promise(function (resolve) {
        iframe.addEventListener('DOMNodeRemoved', function () {
          setTimeout(resolve);
        }, {
          passive: true
        });
      });
    }
    /**
     * Adds a XMLHttpRequest interceptor
     * @param {Function} interceptor the interceptor function
     */

  }, {
    key: "addXHRInterceptor",
    value: function addXHRInterceptor(interceptor) {
      this.$interceptors.xhr.push(interceptor);
    }
    /**
     * Adds a fetch interceptor
     * @param {Function} interceptor the interceptor function
     */

  }, {
    key: "addFetchInterceptor",
    value: function addFetchInterceptor(interceptor) {
      this.$interceptors.fetch.push(interceptor);
    }
    /**
     * Checks if the current window is an iframe
     * @return {HTMLIFrameElement} true if the current window is an iframe.
     * @private
     */

  }, {
    key: "$navigate",

    /**
     * Navigates to the url provided.
     * @param {String} url the url to navigate to
     * @private
     */

    /* istanbul ignore next */
    value: function $navigate(url) {
      location.href = url;
    }
  }, {
    key: "$iframe",
    get: function get() {
      if (window.self === window.top) {
        return null;
      }

      return parent.document.querySelector('body > iframe[owner="salte-auth"]');
    }
    /**
     * Determines if the current window is a popup window opened by salte auth
     * @return {Window} the window object
     * @private
     */

  }, {
    key: "$popup",
    get: function get() {
      if (window.opener && window.name === 'salte-auth') {
        return window;
      }

      return null;
    }
    /**
     * Determines if the page is currently hidden
     * @return {Boolean} true if the page is hidden
     * @private
     */

  }, {
    key: "$hidden",
    get: function get() {
      return document.hidden;
    }
  }]);

  return SalteAuthUtilities;
}();


/* harmony default export */ __webpack_exports__["default"] = (SalteAuthUtilities);

/***/ }),
/* 178 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalteAuthMixinGenerator", function() { return SalteAuthMixinGenerator; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SalteAuthMixinGenerator = function SalteAuthMixinGenerator(auth) {
  var registeredMixedIns = [];
  auth.on('login', function (error, user) {
    if (error) {
      console.error(error);
      return;
    }

    for (var i = 0; i < registeredMixedIns.length; i++) {
      registeredMixedIns[i].user = user;
      registeredMixedIns[i].authenticated = !auth.profile.idTokenExpired;
    }
  });
  auth.on('logout', function (error) {
    if (error) {
      console.error(error);
      return;
    }

    for (var i = 0; i < registeredMixedIns.length; i++) {
      registeredMixedIns[i].user = null;
      registeredMixedIns[i].authenticated = false;
    }
  });
  auth.on('expired', function () {
    for (var i = 0; i < registeredMixedIns.length; i++) {
      registeredMixedIns[i].authenticated = false;
    }
  });
  return function (superClass) {
    return (
      /*#__PURE__*/
      function (_superClass) {
        _inherits(_class, _superClass);

        function _class() {
          var _this;

          _classCallCheck(this, _class);

          _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
          registeredMixedIns.push(_assertThisInitialized(_this));
          _this.user = auth.profile.userInfo || null;
          _this.authenticated = !auth.profile.idTokenExpired;
          return _this;
        }

        _createClass(_class, [{
          key: "auth",
          get: function get() {
            return auth;
          }
        }, {
          key: "user",
          get: function get() {
            return this.$$user;
          },
          set: function set(user) {
            var oldUser = this.$$user;
            this.$$user = user;

            if (this.requestUpdate) {
              this.requestUpdate('user', oldUser);
            }
          }
        }, {
          key: "authenticated",
          get: function get() {
            return this.$$authenticated;
          },
          set: function set(authenticated) {
            var oldAuthenticated = this.$$authenticated;
            this.$$authenticated = authenticated;

            if (this.requestUpdate) {
              this.requestUpdate('authenticated', oldAuthenticated);
            }
          }
        }]);

        return _class;
      }(superClass)
    );
  };
};


/* harmony default export */ __webpack_exports__["default"] = (SalteAuthMixinGenerator);

/***/ })
/******/ ]);
});
//# sourceMappingURL=salte-auth.js.map