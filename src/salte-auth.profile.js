import { defaults, get, set } from 'lodash';
import moment from 'moment';

class SalteAuthProfile {
  /**
   * Parses the current url for the authentication values
   * @param {Object} config the authentication config
   */
  constructor(config) {
    if (window.salte.SalteAuthProfile.$instance) {
      return window.salte.SalteAuthProfile.$instance;
    }
    window.salte.SalteAuthProfile.$instance = this;
    this.$$config = defaults(config, {
      storageType: 'session'
    });
    if (location.hash) {
      const params = location.hash.replace(/(#!?[^#]+)?#/, '').split('&');
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        const [key, value] = param.split('=');
        this.parse(key, value);
      }
    }
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
   * @return {Boolean} true if the "id_token" has expired
   */
  get idTokenExpired() {
    return !this.idToken || moment().unix() >= this.userInfo.exp;
  }

  /**
   * @return {Boolean} true if the "access_token" has expired
   */
  get accessTokenExpired() {
    return !this.accessToken || moment().unix() >= this.expiration;
  }

  get tokenType() {
    return this.$storage.getItem('salte.auth.token-type');
  }

  set tokenType(tokenType) {
    this.saveItem('salte.auth.token-type', tokenType);
  }

  /**
   * The date and time that the access token will expire
   * @return {Moment} the expiration time as a moment object
   */
  get expiration() {
    return this.$storage.getItem('salte.auth.expiration');
  }

  set expiration(expiration) {
    this.saveItem('salte.auth.expiration', expiration);
  }

  get accessToken() {
    return this.$storage.getItem('salte.auth.access-token');
  }

  set accessToken(accessToken) {
    this.saveItem('salte.auth.access-token', accessToken);
  }

  get idToken() {
    return this.$storage.getItem('salte.auth.id-token');
  }

  set idToken(idToken) {
    this.saveItem('salte.auth.id-token', idToken);
  }

  get state() {
    return this.$storage.getItem('salte.auth.state');
  }

  set state(state) {
    this.saveItem('salte.auth.state', state);
  }

  get localState() {
    return this.$storage.getItem('salte.auth.local-state');
  }

  set localState(localState) {
    this.saveItem('salte.auth.local-state', localState);
  }

  get error() {
    return this.$storage.getItem('salte.auth.error');
  }

  set error(error) {
    this.saveItem('salte.auth.error', error);
  }

  get errorDescription() {
    return this.$storage.getItem('salte.auth.error-description');
  }

  set errorDescription(errorDescription) {
    this.saveItem('salte.auth.error-description', errorDescription);
  }

  get redirectUrl() {
    return this.$storage.getItem('salte.auth.redirect-url');
  }

  set redirectUrl(redirectUrl) {
    this.saveItem('salte.auth.redirect-url', redirectUrl);
  }

  get nonce() {
    return this.$storage.getItem('salte.auth.nonce');
  }

  set nonce(nonce) {
    this.saveItem('salte.auth.nonce', nonce);
  }

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
   * @return {String} the error message
   */
  validate() {
    if (this.error) {
      return {
        code: this.error,
        description: this.errorDescription
      };
    } else if (!this.accessToken && this.nonce !== this.userInfo.nonce) {
      // TODO: Get Nonce validation working for Access Tokens
      return {
        code: 'invalid_nonce',
        description: 'Nonce provided by gateway did not match local nonce.'
      };
    } else if (this.localState !== this.state) {
      return {
        code: 'invalid_state',
        description: 'State provided by gateway did not match local state.'
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
   * @param {String} storageType the name of the storageType to use
   * @return {Storage} the storage api to save and pull values from
   */
  get $storage() {
    return this.$$getStorage(this.$$config.storageType);
  }

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
      if (key.indexOf('salte.auth.') === 0) {
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
export default get(window, 'salte.SalteAuthProfile.$instance');
