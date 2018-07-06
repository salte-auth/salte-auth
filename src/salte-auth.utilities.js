import assign from 'lodash/assign';
import debug from 'debug';

const logger = debug('@salte-io/salte-auth:utilities');

/**
 * Basic utilities to support the authentication flow
 */
class SalteAuthUtilities {
  /**
   * Wraps all XHR and Fetch (if available) requests to allow promise interceptors
   * @param {Config} config configuration for salte auth
   */
  constructor(config) {
    /** @ignore */
    this.$$config = config;

    /** @ignore */
    this.$interceptors = {
      fetch: [],
      xhr: []
    };

    logger('Setting up wrappers for XMLHttpRequest...');
    (function(open) {
      XMLHttpRequest.prototype.open = function(method, url) {
        /** @ignore */
        this.$url = url;
        return open.call(this, method, url);
      };
    })(XMLHttpRequest.prototype.open);

    const self = this;
    (function(send) {
      XMLHttpRequest.prototype.send = function(data) {
        const promises = [];
        for (let i = 0; i < self.$interceptors.xhr.length; i++) {
          const interceptor = self.$interceptors.xhr[i];
          promises.push(interceptor(this, data));
        }
        Promise.all(promises).then(() => {
          send.call(this, data);
        }).catch((error) => {
          const event = document.createEvent('Event');
          event.initEvent('error', false, true);
          event.detail = error;
          this.dispatchEvent(event);
        });
      };
    })(XMLHttpRequest.prototype.send);

    if (window.fetch) {
      logger('Fetch detected, setting up wrappers...');
      (function(fetch) {
        window.fetch = function(input, options) {
          const request = input instanceof Request ? input : new Request(input, options);

          const promises = [];
          for (let i = 0; i < self.$interceptors.fetch.length; i++) {
            const interceptor = self.$interceptors.fetch[i];
            promises.push(interceptor(request));
          }
          return Promise.all(promises).then(() => {
            return fetch.call(this, input, options);
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
  createUrl(baseUrl, queryParams = {}) {
    let url = baseUrl;

    Object.keys(queryParams).forEach((key) => {
      const value = queryParams[key];
      if ([undefined, null, ''].indexOf(value) === -1) {
        url += `${url.indexOf('?') === -1 ? '?' : '&'}${key}=${encodeURIComponent(value)}`;
      }
    });

    return url;
  }

  /**
   * Converts a url to an absolute url
   * @param {String} path the url path to resolve to an absolute url
   * @return {String} the absolutely resolved url
   */
  resolveUrl(path) {
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
    return this.$$urlAnchor.href;
  }

  /**
   * Checks if the given url matches any of the test urls
   * @param {String} url The url to test
   * @param {Array<String|RegExp>} tests The urls to match the test url against
   * @return {Boolean} true if the url matches one of the tests
   */
  checkForMatchingUrl(url, tests = []) {
    const resolvedUrl = this.resolveUrl(url);
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      if (test instanceof RegExp) {
        return !!resolvedUrl.match(test);
      } else {
        return resolvedUrl.indexOf(this.resolveUrl(test)) === 0;
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
  isRouteSecure(route, securedRoutes) {
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
  openPopup(url, name = 'salte-auth', height = 600, width = 400) {
    const top = ((window.innerHeight / 2) - (height / 2)) + window.screenTop;
    const left = ((window.innerWidth / 2) - (width / 2)) + window.screenLeft;
    const popupWindow = window.open(url, name, `height=${height}, width=${width}, status=yes, toolbar=no, menubar=no, location=no, top=${top}, left=${left}`);
    if (!popupWindow) {
      return Promise.reject(new ReferenceError('We were unable to open the popup window, its likely that the request was blocked.'));
    }

    popupWindow.focus();
    // TODO: Find a better way of tracking when a Window closes.
    return new Promise((resolve) => {
      const checker = setInterval(() => {
        try {
          // This could throw cross-domain errors, so we need to silence them.
          const loginUrl = this.$$config.redirectUrl && this.$$config.redirectUrl.loginUrl || this.$$config.redirectUrl;
          const logoutUrl = this.$$config.redirectUrl && this.$$config.redirectUrl.logoutUrl || this.$$config.redirectUrl;
          if (popupWindow.location.href.indexOf(loginUrl) !== 0 || popupWindow.location.href.indexOf(logoutUrl) !== 0) return;

          location.hash = popupWindow.location.hash;
          popupWindow.close();
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
  openNewTab(url) {
    const tabWindow = window.open(url, '_blank');
    if (!tabWindow) {
      return Promise.reject(new ReferenceError('We were unable to open the new tab, its likely that the request was blocked.'));
    }

    tabWindow.name = 'salte-auth';
    tabWindow.focus();
    // TODO: Find a better way of tracking when a Window closes.
    return new Promise((resolve) => {
      const checker = setInterval(() => {
        try {
          // This could throw cross-domain errors, so we need to silence them.
          const loginUrl = this.$$config.redirectUrl && this.$$config.redirectUrl.loginUrl || this.$$config.redirectUrl;
          const logoutUrl = this.$$config.redirectUrl && this.$$config.redirectUrl.logoutUrl || this.$$config.redirectUrl;
          if (tabWindow.location.href.indexOf(loginUrl) !== 0 || tabWindow.location.href.indexOf(logoutUrl) !== 0) return;

          location.hash = tabWindow.location.hash;
          tabWindow.close();
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
  createIframe(url, show) {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('owner', 'salte-auth');
    if (show) {
      assign(iframe.style, {
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

      setTimeout(() => {
        iframe.style.opacity = 1;
      });
    } else {
      iframe.style.display = 'none';
    }
    iframe.src = url;
    document.body.appendChild(iframe);
    return new Promise((resolve) => {
      iframe.addEventListener('DOMNodeRemoved', () => {
        setTimeout(resolve);
      }, { passive: true });
    });
  }

  /**
   * Adds a XMLHttpRequest interceptor
   * @param {Function} interceptor the interceptor function
   */
  addXHRInterceptor(interceptor) {
    this.$interceptors.xhr.push(interceptor);
  }

  /**
   * Adds a fetch interceptor
   * @param {Function} interceptor the interceptor function
   */
  addFetchInterceptor(interceptor) {
    this.$interceptors.fetch.push(interceptor);
  }

  /**
   * Checks if the current window is an iframe
   * @return {HTMLIFrameElement} true if the current window is an iframe.
   * @private
   */
  get $iframe() {
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
  get $popup() {
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
  get $hidden() {
    return document.hidden;
  }

  /**
   * Navigates to the url provided.
   * @param {String} url the url to navigate to
   * @private
   */
  /* istanbul ignore next */
  $navigate(url) {
    location.href = url;
  }
}

export { SalteAuthUtilities };
export default SalteAuthUtilities;
