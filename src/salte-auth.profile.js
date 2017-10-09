import { defaultsDeep, find, get, set } from 'lodash';
import moment from 'moment';

/**
 * All the profile information associated with the current authentication session
 */
class SalteAuthProfile {
  /**
   * Parses the current url for the authentication values
   * @param {Config} config configuration for salte auth
   */
  constructor(config) {
    if (window.salte.SalteAuthProfile.$instance) {
      return window.salte.SalteAuthProfile.$instance;
    }
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
    if (location.hash) {
      const params = location.hash.replace(/(#!?[^#]+)?#/, '').split('&');
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        const [key, value] = param.split('=');
        this.parse(key, decodeURIComponent(value));
      }
    }
    window.salte.SalteAuthProfile.$instance = this;
  }

  /**
   * Parse a key-value pair
   * @param {String} key the key to parse
   * @param {Object} value the matching value to parse
   */
  parse(key, value) {
    switch (key) {
      case 'token_type':
        this.tokenType = value;
        break;
      case 'expires_in':
        this.expiration = moment().add(value, 's').unix();
        break;
      case 'access_token':
        this.accessToken = value;
        break;
      case 'id_token':
        this.idToken = value;
        break;
      case 'state':
        this.state = value;
        break;
      case 'error':
        this.error = value;
        break;
      case 'error_description':
        this.errorDescription = value;
        break;
    }
  }

  /**
   * Whether the ID Token has expired
   * @return {Boolean} true if the "id_token" has expired
   */
  get idTokenExpired() {
    return !this.idToken || moment().unix() >= this.userInfo.exp;
  }

  /**
   * Whether the Access Token has expired
   * @return {Boolean} true if the "access_token" has expired
   */
  get accessTokenExpired() {
    return !this.accessToken || moment().unix() >= this.expiration;
  }

  /**
   * The type of Access Token that was returned by the identity provider
   * @return {String} the type of access token
   */
  get tokenType() {
    return this.$storage.getItem('salte.auth.token-type');
  }

  set tokenType(tokenType) {
    this.saveItem('salte.auth.token-type', tokenType);
  }

  /**
   * The date and time that the access token will expire
   * @return {String} the expiration time as unix timestamp
   */
  get expiration() {
    return this.$storage.getItem('salte.auth.expiration');
  }

  set expiration(expiration) {
    this.saveItem('salte.auth.expiration', expiration);
  }

  /**
   * The Access Token returned by the identity provider
   * @return {String} the access token
   */
  get accessToken() {
    return this.$storage.getItem('salte.auth.access-token');
  }

  set accessToken(accessToken) {
    this.saveItem('salte.auth.access-token', accessToken);
  }

  /**
   * The ID Token returned by the identity provider
   * @return {String} the id token
   */
  get idToken() {
    return this.$storage.getItem('salte.auth.id-token');
  }

  set idToken(idToken) {
    this.saveItem('salte.auth.id-token', idToken);
  }

  /**
   * The authentication state returned by the identity provider
   * @return {String} the state value
   *
   * @see https://tools.ietf.org/html/rfc6749#section-4.1.1
   */
  get state() {
    return this.$storage.getItem('salte.auth.state');
  }

  set state(state) {
    this.saveItem('salte.auth.state', state);
  }

  /**
   * The locally generate authentication state
   * @return {String} the local state value
   *
   * @see https://tools.ietf.org/html/rfc6749#section-4.1.1
   */
  get localState() {
    return this.$storage.getItem('salte.auth.local-state');
  }

  set localState(localState) {
    this.saveItem('salte.auth.local-state', localState);
  }

  /**
   * The error returned by the identity provider
   * @return {String} the state value
   */
  get error() {
    return this.$storage.getItem('salte.auth.error');
  }

  set error(error) {
    this.saveItem('salte.auth.error', error);
  }

  /**
   * The error description returned by the identity provider
   * @return {String} a string that describes the error that occurred
   */
  get errorDescription() {
    return this.$storage.getItem('salte.auth.error-description');
  }

  set errorDescription(errorDescription) {
    this.saveItem('salte.auth.error-description', errorDescription);
  }

  /**
   * The url the user originated from before authentication occurred
   * @return {String} The url the user originated from before authentication occurred
   */
  get redirectUrl() {
    return this.$storage.getItem('salte.auth.$redirect-url');
  }

  set redirectUrl(redirectUrl) {
    this.saveItem('salte.auth.$redirect-url', redirectUrl);
  }

  /**
   * Parses the User Info from the ID Token
   * @return {String} The User Info from the ID Token
   */
  get nonce() {
    return this.$storage.getItem('salte.auth.nonce');
  }

  set nonce(nonce) {
    this.saveItem('salte.auth.nonce', nonce);
  }

  /**
   * Parses the User Info from the ID Token
   * @return {Object} The User Info from the ID Token
   */
  get userInfo() {
    if (this.idToken) {
      const separatedToken = this.idToken.split('.');
      if (separatedToken.length === 3) {
        return JSON.parse(atob(separatedToken[1]));
      }
    }
    return null;
  }

  /**
   * Verifies that we were logged in successfully and that all security checks pass
   * @param {Boolean} accessTokenRequest if the request we're validating was an access token request
   * @return {Object} the error message
   */
  validate(accessTokenRequest) {
    if (!this.$$config.validation) {
      return;
    }

    if (this.error) {
      return {
        code: this.error,
        description: this.errorDescription
      };
    }

    if (this.$$config.validation.state && this.localState !== this.state) {
      return {
        code: 'invalid_state',
        description: 'State provided by gateway did not match local state.'
      };
    }

    if (accessTokenRequest) return;

    if (this.$$config.validation.nonce && this.nonce !== this.userInfo.nonce) {
      return {
        code: 'invalid_nonce',
        description: 'Nonce provided by gateway did not match local nonce.'
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
   * @param {*} value The value to save, if this is undefined or null it will delete the key
   */
  saveItem(key, value) {
    if ([undefined, null].indexOf(value) !== -1) {
      this.$storage.removeItem(key);
    } else {
      this.$storage.setItem(key, value);
    }
  }

  /**
   * Return the active Web Storage API
   * @return {Storage} the storage api to save and pull values from
   */
  get $storage() {
    return this.$$getStorage(this.$$config.storageType);
  }

  /**
   * Determines which Web Storage API to return using the name provided
   * @param {String} storageType the name of the storageType to use
   * @return {Storage} the web storage api that matches the given string
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
   * Transfers values from one storage type to the other
   * @param {String} source the name of the storage type to pull from
   * @param {String} destination the name of the storage type to push to
   */
  $$transfer(source, destination) {
    const sourceStorage = this.$$getStorage(source);
    const destinationStorage = this.$$getStorage(destination);

    for (const key in sourceStorage) {
      if (key.indexOf('salte.auth.') !== 0) continue;

      destinationStorage.setItem(key, sourceStorage.getItem(key));
      sourceStorage.removeItem(key);
    }
  }

  /**
   * Clears all `salte.auth` values from localStorage
   */
  clear() {
    for (const key in this.$storage) {
      if (key.match(/^salte\.auth\.[^$]/)) {
        this.saveItem(key, undefined);
      }
    }
  }

  /**
   * Clears all `salte.auth` error values from localStorage
   */
  clearErrors() {
    this.error = undefined;
    this.errorDescription = undefined;
  }
}

set(window, 'salte.SalteAuthProfile', get(window, 'salte.SalteAuthProfile', SalteAuthProfile));
export { SalteAuthProfile };
