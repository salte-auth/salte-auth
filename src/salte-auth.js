import { assign, get, set } from 'lodash';
import uuid from 'uuid';

import providers from './salte-auth.providers.js';
import { SalteAuthProfile } from './salte-auth.profile.js';
import { SalteAuthUtilities } from './salte-auth.utilities.js';

class SalteAuth {
  constructor(config) {
    if (window.salte.auth) {
      return window.salte.auth;
    }
    window.salte.auth = this;
    this.$promises = {};
    this.$config = config || {};
    this.providers = providers;
    this.profile = new SalteAuthProfile();
    this.utilities = new SalteAuthUtilities();

    if (this.utilities.iframe) {
      parent.document.body.removeChild(this.utilities.iframe);
    } else if (this.utilities.popup) {
      setTimeout(this.utilities.popup.close);
    } else if (this.profile.redirectUrl && location.href !== this.profile.redirectUrl) {
      location.href = this.profile.redirectUrl;
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

  get accessTokenUrl() {
    this.profile.localState = uuid.v4();
    this.profile.nonce = uuid.v4();

    return this.utilities.createUrl(`${this.$config.gateway}/authorize`, assign({
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
   * The computed authentication url
   */
  get authorizeUrl() {
    this.profile.localState = uuid.v4();
    this.profile.nonce = uuid.v4();

    return this.utilities.createUrl(`${this.$config.gateway}/authorize`, assign({
      'state': this.profile.localState,
      'nonce': this.profile.nonce,
      'response_type': this.$config.responseType,
      'redirect_uri': this.$config.redirectUrl,
      'client_id': this.$config.clientId,
      'scope': this.$config.scope
    }, this.$config.queryParams));
  }

  /**
   * The computed deauthentication url
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
   * Unauthenticates using the redirect-based OAuth flow.
   */
  signOutWithRedirect() {
    this.profile.clear();
    location.href = this.deauthorizeUrl;
  }

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

  $$onRouteChanged() {
    if (!this.utilities.isRouteSecure(location.href, this.$config.routes)) return;

    this.retrieveAccessToken();
  }
}

set(window, 'salte.SalteAuth', get(window, 'salte.SalteAuth', SalteAuth));
export { SalteAuth };
export default get(window, 'salte.auth');
