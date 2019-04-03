import defaultsDeep from 'lodash/defaultsDeep';
import find from 'lodash/find';
import debug from 'debug';

/** @ignore */
const logger = debug('@salte-auth/salte-auth:profile');

/**
 * All the profile information associated with the current authentication session
 */
class SalteAuthProfile {
  /**
   * Parses the current url for the authentication values
   * @param {Config} config configuration for salte auth
   */
  constructor(config) {
    logger('Appending defaults to config...');
    /** @ignore */
    this.$$config = defaultsDeep(config, {
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
  $parseParams() {
    if (location.search || location.hash) {
      const params = location.search.replace(/^\?/, '').split('&')
        .concat(location.hash.replace(/(#!?[^#]+)?#/, '').split('&'));

      logger(`Hash detected, parsing...`, params);
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        const [key, value] = param.split('=');
        this.$parse(key, decodeURIComponent(value));
      }
      logger(`Removing hash...`);
      history.pushState('', document.title, location.href.replace(location.search, '').replace(location.hash, ''));
    }
  }

  /**
   * Parse a key-value pair
   * @param {String} key the key to parse
   * @param {Object} value the matching value to parse
   * @private
   */
  $parse(key, value) {
    switch (key) {
      case 'token_type':
        this.$tokenType = value;
        break;
      case 'expires_in':
        this.$expiration = Date.now() + (Number(value) * 1000);
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
    }
  }

  /**
   * Whether the ID Token has expired
   * @return {Boolean} true if the "id_token" has expired
   */
  get idTokenExpired() {
    return !this.$idToken || Date.now() >= (this.userInfo.exp * 1000);
  }

  /**
   * Whether the Access Token has expired
   * @return {Boolean} true if the "access_token" has expired
   */
  get accessTokenExpired() {
    return !this.$accessToken || Date.now() >= this.$expiration;
  }

  /**
   * The type of Access Token that was returned by the identity provider
   * @return {String} the type of access token
   * @private
   */
  get $tokenType() {
    return this.$getItem('salte.auth.$token-type', 'session');
  }

  set $tokenType(tokenType) {
    this.$saveItem('salte.auth.$token-type', tokenType, 'session');
  }

  /**
   * The date and time that the access token will expire
   * @return {Number} the expiration time as unix timestamp
   * @private
   */
  get $expiration() {
    const expiration = this.$getItem('salte.auth.expiration');
    return expiration ? Number(expiration) : null;
  }

  set $expiration(expiration) {
    this.$saveItem('salte.auth.expiration', expiration);
  }

  /**
   * The Access Token returned by the identity provider
   * @return {String} the access token
   * @private
   */
  get $accessToken() {
    return this.$getItem('salte.auth.access-token');
  }

  set $accessToken(accessToken) {
    this.$saveItem('salte.auth.access-token', accessToken);
  }

  /**
   * The ID Token returned by the identity provider
   * @return {String} the id token
   * @private
   */
  get $idToken() {
    return this.$getItem('salte.auth.id-token');
  }

  set $idToken(idToken) {
    this.$saveItem('salte.auth.id-token', idToken);
  }

  /**
   * The Authorization Code returned by the identity provider
   * @return {String} the authorization code
   * @private
   */
  get code() {
    return this.$getItem('salte.auth.code');
  }

  set code(code) {
    this.$saveItem('salte.auth.code', code);
  }

  /**
   * The authentication state returned by the identity provider
   * @return {String} the state value
   * @private
   *
   * @see https://tools.ietf.org/html/rfc6749#section-4.1.1
   */
  get $state() {
    return this.$getItem('salte.auth.$state', 'session');
  }

  set $state(state) {
    this.$saveItem('salte.auth.$state', state, 'session');
  }

  /**
   * The locally generate authentication state
   * @return {String} the local state value
   * @private
   *
   * @see https://tools.ietf.org/html/rfc6749#section-4.1.1
   */
  get $localState() {
    return this.$getItem('salte.auth.$local-state', 'session');
  }

  set $localState(localState) {
    this.$saveItem('salte.auth.$local-state', localState, 'session');
  }

  /**
   * The error returned by the identity provider
   * @return {String} the state value
   * @private
   */
  get $error() {
    return this.$getItem('salte.auth.error');
  }

  set $error(error) {
    this.$saveItem('salte.auth.error', error);
  }

  /**
   * The error description returned by the identity provider
   * @return {String} a string that describes the error that occurred
   * @private
   */
  get $errorDescription() {
    return this.$getItem('salte.auth.error-description');
  }

  set $errorDescription(errorDescription) {
    this.$saveItem('salte.auth.error-description', errorDescription);
  }

  /**
   * The url the user originated from before authentication occurred
   * @return {String} The url the user originated from before authentication occurred
   * @private
   */
  get $redirectUrl() {
    return this.$getItem('salte.auth.$redirect-url', 'session');
  }

  set $redirectUrl(redirectUrl) {
    this.$saveItem('salte.auth.$redirect-url', redirectUrl, 'session');
  }

  /**
   * Parses the User Info from the ID Token
   * @return {String} The User Info from the ID Token
   * @private
   */
  get $nonce() {
    return this.$getItem('salte.auth.$nonce', 'session');
  }

  set $nonce(nonce) {
    this.$saveItem('salte.auth.$nonce', nonce, 'session');
  }

  /**
   * Sets or Gets an action based on whether a action was passed.
   * @param {String} state The state this action is tied to.
   * @param {String} action The action to store.
   * @return {String|undefined} Returns a string if an action wasn't provided.
   * @private
   */
  $actions(state, action) {
    if (action) {
      this.$saveItem(`salte.auth.action.${state}`, action);
    } else {
      return this.$getItem(`salte.auth.action.${state}`);
    }
  }

  /**
   * Parses the User Info from the ID Token
   * @param {String} idToken the id token to update based off
   * @private
   */
  $refreshUserInfo(idToken = this.$idToken) {
    let userInfo = null;

    if (idToken) {
      const separatedToken = idToken.split('.');
      if (separatedToken.length === 3) {
        // This fixes an issue where various providers will encode values
        // incorrectly and cause the browser to fail to decode.
        // https://stackoverflow.com/questions/43065553/base64-decoded-differently-in-java-jjwt
        const payload = separatedToken[1].replace(/-/g, '+').replace(/_/g, '/');
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
  $validate(accessTokenRequest) {
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

    if ((this.$$config.responseType === 'code' && !this.code) || (this.$$config.responseType !== 'code' && !this.$idToken)) {
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
        const aud = find(this.userInfo.aud, (audience) => {
          return audience === this.$$config.clientId;
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
  $getItem(key, overrideStorageType) {
    const storage = overrideStorageType ? this.$$getStorage(overrideStorageType) : this.$storage;
    return storage.getItem(key);
  }

  /**
   * Saves a value to the Web Storage API
   * @param {String} key The key to save to
   * @param {*} value The value to save, if this is undefined or null it will delete the key
   * @param {String} overrideStorageType the name of the storageType to use
   * @private
   */
  $saveItem(key, value, overrideStorageType) {
    const storage = overrideStorageType ? this.$$getStorage(overrideStorageType) : this.$storage;
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
  get $storage() {
    return this.$$getStorage(this.$$config.storageType);
  }

  /**
   * Determines which Web Storage API to return using the name provided
   * @param {String} storageType the name of the storageType to use
   * @return {Storage} the web storage api that matches the given string
   * @ignore
   */
  $$getStorage(storageType) {
    if (storageType === 'local') {
      return localStorage;
    } else if (storageType === 'session') {
      return sessionStorage;
    } else {
      throw new ReferenceError(`Unknown Storage Type (${storageType})`);
    }
  }

  /**
   * Clears all `salte.auth` values from localStorage
   * @private
   */
  $clear() {
    for (const key in localStorage) {
      if (key.match(/^salte\.auth\.[^$]/)) {
        localStorage.removeItem(key);
      }
    }

    for (const key in sessionStorage) {
      if (key.match(/^salte\.auth\.[^$]/)) {
        sessionStorage.removeItem(key);
      }
    }

    this.$refreshUserInfo();
  }

  /**
   * Clears all `salte.auth` error values from localStorage
   * @private
   */
  $clearErrors() {
    this.$error = undefined;
    this.$errorDescription = undefined;
  }
}

export { SalteAuthProfile };
export default SalteAuthProfile;
