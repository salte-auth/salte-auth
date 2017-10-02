import { assign, get, set } from 'lodash';
import uuid from 'uuid';

import { Providers } from './salte-auth.providers.js';
import { SalteAuthProfile } from './salte-auth.profile.js';
import { SalteAuthUtilities } from './salte-auth.utilities.js';

/**
 * The configuration for salte auth
 * @typedef {Object} Config
 * @property {String} gateway The Gateway url
 * @property {('id_token'|'id_token token')} responseType The response type
 * @property {String} redirectUrl The redirect url
*
 * @property {String} clientId The client id of your identity provider
 * @property {String} scope The scopes to pass
 * @property {Boolean|String[]} routes The secured routes
 * @property {String[]} endpoints The secured endpoints
 * @property {('auth0'|'cognito'|'wso2')} provider The provider
 */
/** Salte Auth */
class SalteAuth {
  /**
   * Sets up Salte Auth
   * @param {Config} config configuration for salte auth
   */
  constructor(config) {
    if (window.salte.auth) {
      return window.salte.auth;
    }
    window.salte.auth = this;

    /** @ignore */
    this.$promises = {};
    /** @ignore */
    this.$config = config || {};
    /** @type {Providers} */
    this.providers = Providers;
    /** @type {SalteAuthProfile} */
    this.profile = new SalteAuthProfile(this.$config);
    /** @type {SalteAuthUtilities} */
    this.utilities = new SalteAuthUtilities();

    if (this.utilities.iframe) {
      parent.document.body.removeChild(this.utilities.iframe);
    } else if (this.utilities.popup) {
      // We need to utilize local storage to retain our parsed values
      if (this.$config.storageType === 'session') {
        this.profile.$$transfer('session', 'local');
      }
      setTimeout(this.utilities.popup.close);
    } else if (this.profile.redirectUrl && location.href !== this.profile.redirectUrl) {
      history.pushState({}, null, this.profile.redirectUrl);
      this.profile.redirectUrl = undefined;
    } else {
      this.utilities.addXHRInterceptor((request, data) => {
        if (this.utilities.checkForMatchingUrl(request.$url, this.$config.endpoints)) {
          return this.retrieveAccessToken().then((accessToken) => {
            request.setRequestHeader('Authorization', `Bearer ${accessToken}`);
          });
        }
      });

      this.utilities.addFetchInterceptor((input, options) => {
        if (this.utilities.checkForMatchingUrl(input, this.$config.endpoints)) {
          return this.retrieveAccessToken().then((accessToken) => {
            options.headers = options.headers || {};
            options.headers.Authorization = `Bearer ${accessToken}`;
          });
        }
      });

      window.addEventListener('popstate', this.$$onRouteChanged.bind(this));
      document.addEventListener('click', this.$$onRouteChanged.bind(this));
      setTimeout(this.$$onRouteChanged.bind(this));
    }
  }

  /**
   * Returns the configured provider
   * @type {Class|Object}
   */
  get provider() {
    if (!this.$config.provider) {
      throw new ReferenceError('A provider must be specified');
    }

    if (typeof this.$config.provider === 'string') {
      const provider = this.providers[this.$config.provider];
      if (!provider) {
        throw new ReferenceError(`Unknown Provider (${this.$config.provider})`);
      }
      return provider;
    }

    return this.$config.provider;
  }

  /**
   * The authentication url to retrieve the access token
   * @type {String}
   */
  get accessTokenUrl() {
    this.profile.localState = uuid.v4();
    this.profile.nonce = uuid.v4();

    let authorizeGateway = `${this.$config.gateway}/authorize`;
    if (this.provider.authorizeUrl) {
      authorizeGateway = this.provider.authorizeUrl.call(this, this.$config);
    }

    return this.utilities.createUrl(authorizeGateway, assign({
      'state': this.profile.localState,
      'nonce': this.profile.nonce,
      'response_type': 'token',
      'redirect_uri': this.$config.redirectUrl,
      'client_id': this.$config.clientId,
      'scope': this.$config.scope,
      'prompt': 'none'
    }, this.$config.queryParams));
  }

  /**
   * The authentication url to retrieve the id token
   * @type {String}
   */
  get authorizeUrl() {
    this.profile.localState = uuid.v4();
    this.profile.nonce = uuid.v4();

    let authorizeGateway = `${this.$config.gateway}/authorize`;
    if (this.provider.authorizeUrl) {
      authorizeGateway = this.provider.authorizeUrl.call(this, this.$config);
    }

    return this.utilities.createUrl(authorizeGateway, assign({
      'state': this.profile.localState,
      'nonce': this.profile.nonce,
      'response_type': this.$config.responseType,
      'redirect_uri': this.$config.redirectUrl,
      'client_id': this.$config.clientId,
      'scope': this.$config.scope
    }, this.$config.queryParams));
  }

  /**
   * The url to logout of the configured provider
   * @type {String}
   */
  get deauthorizeUrl() {
    return this.provider.deauthorizeUrl.call(this, this.$config);
  }

  /**
   * Authenticates using the iframe-based OAuth flow.
   * @return {Promise} a promise that resolves when we finish authenticating
   */
  signInWithIframe() {
    if (this.$promises.login) {
      return this.$promises.login;
    }

    this.profile.clear();
    this.$promises.login = this.utilities.createIframe(this.authorizeUrl, true).then(() => {
      this.$promises.login = null;
      const error = this.profile.validate();

      if (error) {
        return Promise.reject(error);
      }
    });

    return this.$promises.login;
  }

  /**
   * Authenticates using the popup-based OAuth flow.
   * @return {Promise} a promise that resolves when we finish authenticating
   */
  signInWithPopup() {
    if (this.$promises.login) {
      return this.$promises.login;
    }

    this.profile.clear();
    this.$promises.login = this.utilities.openPopup(this.authorizeUrl).then(() => {
      this.$promises.login = null;
      // We need to utilize local storage to retain our parsed values
      if (this.$config.storageType === 'session') {
        this.profile.$$transfer('local', 'session');
      }
      const error = this.profile.validate();

      if (error) {
        return Promise.reject(error);
      }
    });

    return this.$promises.login;
  }

  /**
   * Authenticates using the redirect-based OAuth flow.
   */
  signInWithRedirect() {
    this.profile.clear();
    this.profile.redirectUrl = location.href;
    location.href = this.authorizeUrl;
    // TODO: How do we validate that we logged in successfully?
  }

  /**
   * Unauthenticates using the iframe-based OAuth flow.
   * @return {Promise} a promise that resolves when we finish deauthenticating
   */
  signOutWithIframe() {
    if (this.$promises.logout) {
      return this.$promises.logout;
    }

    this.profile.clear();
    this.$promises.logout = this.utilities.createIframe(this.deauthorizeUrl).then(() => {
      this.$promises.logout = null;
    });
    return this.$promises.logout;
  }

  /**
   * Unauthenticates using the popup-based OAuth flow.
   * @return {Promise} a promise that resolves when we finish deauthenticating
   */
  signOutWithPopup() {
    if (this.$promises.logout) {
      return this.$promises.logout;
    }

    this.profile.clear();
    this.$promises.logout = this.utilities.openPopup(this.deauthorizeUrl).then(() => {
      this.$promises.logout = null;
    });

    return this.$promises.logout;
  }

  /**
   * Logs the user out of their configured identity provider.
   */
  signOutWithRedirect() {
    this.profile.clear();
    location.href = this.deauthorizeUrl;
  }

  /**
   * Authenticates, requests the access token, and returns it if necessary.
   * @return {Promise<string>} a promise that resolves when we retrieve the access token
   */
  retrieveAccessToken() {
    if (this.$promises.token) {
      return this.$promises.token;
    }

    this.$promises.token = Promise.resolve();
    if (this.profile.idTokenExpired) {
      if (this.$config.loginType === 'popup') {
        this.$promises.token = this.signInWithPopup();
      } else if ([undefined, null, 'iframe'].indexOf(this.$config.loginType) !== -1) {
        this.$promises.token = this.signInWithIframe();
      } else {
        this.$promises.token = null;
        return Promise.reject(new ReferenceError(`Invaid Login Type (${this.$config.loginType})`));
      }
    }

    this.$promises.token = this.$promises.token.then(() => {
      this.profile.clearErrors();
      if (this.profile.accessTokenExpired) {
        return this.utilities.createIframe(this.accessTokenUrl).then(() => {
          this.$promises.token = null;
          const error = this.profile.validate();

          if (error) {
            return Promise.reject(error);
          }
          return this.profile.accessToken;
        });
      }
      this.$promises.token = null;
      return this.profile.accessToken;
    });

    return this.$promises.token;
  }

  /**
   * Checks if the current route is secured and authenticates the user if necessary
   * @ignore
   */
  $$onRouteChanged() {
    if (!this.utilities.isRouteSecure(location.href, this.$config.routes)) return;

    this.retrieveAccessToken();
  }
}

set(window, 'salte.SalteAuth', get(window, 'salte.SalteAuth', SalteAuth));
export { SalteAuth };
