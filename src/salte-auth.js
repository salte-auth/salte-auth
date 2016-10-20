/**
 * @public
 * @class Config
 * @property {clientId}        Identifier assigned to your app by Azure Active Directory
 * @property {redirectUri}     Endpoint at which you expect to receive tokens
 * @property {instance}        This is the URL path to the identity provider that authorize and logout will be called against.
 * @property {endpoints}       Collection of {Endpoint-ResourceId} used for autmatically attaching tokens in webApi calls
 * @property {scope}           This may be used to define the specific authorization(s) being requested from the resource owner.
 */

/**
 * User information from idtoken.
 *  @class User
 *  @property {string} userName - username assigned from upn, email, or sub (i.e. subject).
 *  @property {object} profile - properties parsed from idtoken.
 */

/**
 * Creates a new AuthenticationContext object.
 * @constructor
 * @param {object}  config               Configuration options for AuthenticationContext
 */
export default class AuthenticationContext {
  constructor(config) {
    /**
    * Enum for request type
    * @enum {string}
    */
    this.REQUEST_TYPE = {
      LOGIN: 'LOGIN',
      RENEW_TOKEN: 'RENEW_TOKEN',
      UNKNOWN: 'UNKNOWN'
    };

    /**
    * Enum for storage constants
    * @enum {string}
    */
    this.CONSTANTS = {
      ACCESS_TOKEN: 'access_token',
      EXPIRES_IN: 'expires_in',
      ID_TOKEN: 'id_token',
      ERROR_DESCRIPTION: 'error_description',
      SESSION_STATE: 'session_state',
      STORAGE: {
        TOKEN_KEYS: 'auth.token.keys',
        ACCESS_TOKEN_KEY: 'auth.access.token.key',
        EXPIRATION_KEY: 'auth.expiration.key',
        STATE_LOGIN: 'auth.state.login',
        STATE_RENEW: 'auth.state.renew',
        NONCE_IDTOKEN: 'auth.nonce.idtoken',
        SESSION_STATE: 'auth.session.state',
        USERNAME: 'auth.username',
        IDTOKEN: 'auth.idtoken',
        ERROR: 'auth.error',
        ERROR_DESCRIPTION: 'auth.error.description',
        LOGIN_REQUEST: 'auth.login.request',
        LOGIN_ERROR: 'auth.login.error',
        RENEW_STATUS: 'auth.token.renew.status'
      },
      RESOURCE_DELIMETER: '|',
      LOADFRAME_TIMEOUT: '6000',
      TOKEN_RENEW_STATUS_CANCELED: 'Canceled',
      TOKEN_RENEW_STATUS_COMPLETED: 'Completed',
      TOKEN_RENEW_STATUS_IN_PROGRESS: 'In Progress',
      LOGGING_LEVEL: {
        ERROR: 0,
        WARN: 1,
        INFO: 2,
        VERBOSE: 3
      },
      LEVEL_STRING_MAP: {
        0: 'ERROR:',
        1: 'WARNING:',
        2: 'INFO:',
        3: 'VERBOSE:'
      },
      POPUP_WIDTH: 483,
      POPUP_HEIGHT: 600
    };

    if (window.AuthenticationContext) {
      return window.AuthenticationContext;
    }
    window.AuthenticationContext = this;

    // public
    this.config = {};
    this.callback = null;
    this.popUp = false;
    this.isAngular = false;
    this.crypto = window.crypto || window.msCrypto;

    // private
    this._user = null;
    this._activeRenewals = {};
    this._loginInProgress = false;
    this._renewStates = [];

    this.callBackMappedToRenewStates = {};
    this.callBacksMappedToRenewStates = {};

    // validate before constructor assignments
    if (config.displayCall && typeof config.displayCall !== 'function') {
      throw new Error('displayCall is not a function');
    }

    if (!config.clientId) {
      throw new Error('clientId is required');
    }

    this.config = this._cloneConfig(config);

    if (this.config.popUp) {
      this.popUp = true;
    }

    if (this.config.callback && typeof this.config.callback === 'function') {
      this.callback = this.config.callback;
    }

    if (!this.config.instance || !this.config.instance.match(/^https:\/\/.*\/$/)) {
      throw new Error('instance must be a valid https endpoint that ends in a forward slash.');
    }

    // App can request idtoken for itself using clientid as resource
    if (!this.config.loginResource) {
      this.config.loginResource = this.config.clientId;
    }

    if (!this.config.redirectUri) {
      this.config.redirectUri = window.location.href;
    }

    if (!this.config.anonymousEndpoints) {
      this.config.anonymousEndpoints = [];
    }

    if (this.config.isAngular) {
      this.isAngular = this.config.isAngular;
    }

    this.setResponseType(this.config.responseType);
  }

  setResponseType(responseType) {
    this.config.responseType = responseType || this.CONSTANTS.ID_TOKEN;
  }

  /**
   * Gets initial Idtoken for the app backend
   * Saves the resulting Idtoken in localStorage.
   * @param {string} startPage the start page
   */
  login(startPage) {
    // Token is not present and user needs to login
    if (this._loginInProgress) {
      this.info('Login in progress');
      return;
    }
    const expectedState = this._guid();
    this.config.state = expectedState;
    this._idTokenNonce = this._guid();
    if (!startPage) {
      startPage = window.location;
    }
    this.verbose('Expected state: ' + expectedState + ' startPage:' + startPage);
    this._saveItem(this.CONSTANTS.STORAGE.LOGIN_REQUEST, startPage);
    this._saveItem(this.CONSTANTS.STORAGE.LOGIN_ERROR, '');
    this._saveItem(this.CONSTANTS.STORAGE.STATE_LOGIN, expectedState);
    this._saveItem(this.CONSTANTS.STORAGE.NONCE_IDTOKEN, this._idTokenNonce);
    this._saveItem(this.CONSTANTS.STORAGE.ERROR, '');
    this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION, '');
    const urlNavigate = this._getNavigateUrl(this.config.responseType, null) + '&nonce=' + encodeURIComponent(this._idTokenNonce);
    this._loginInProgress = true;
    if (this.popUp) {
      this._loginPopup(urlNavigate);
      return;
    }
    if (this.config.displayCall) {
      // User defined way of handling the navigation
      this.config.displayCall(urlNavigate);
    } else {
      this.promptUser(urlNavigate);
    }
  }

  _openPopup(urlNavigate, title, popUpWidth, popUpHeight) {
    try {
      /**
      * adding winLeft and winTop to account for dual monitor
      * using screenLeft and screenTop for IE8 and earlier
      */
      const winLeft = window.screenLeft ? window.screenLeft : window.screenX;
      const winTop = window.screenTop ? window.screenTop : window.screenY;
      /**
      * window.innerWidth displays browser window's height and width excluding toolbars
      * using document.documentElement.clientWidth for IE8 and earlier
      */
      const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      const left = ((width / 2) - (popUpWidth / 2)) + winLeft;
      const top = ((height / 2) - (popUpHeight / 2)) + winTop;

      const popupWindow = this.open(urlNavigate, title, 'width=' + popUpWidth + ', height=' + popUpHeight + ', top=' + top + ', left=' + left);
      if (popupWindow.focus) {
        popupWindow.focus();
      }
      return popupWindow;
    } catch (e) {
      this.warn('Error opening popup, ' + e.message);
      this._loginInProgress = false;
      return null;
    }
  }

  _loginPopup(urlNavigate) {
    const popupWindow = this._openPopup(urlNavigate, 'login', this.CONSTANTS.POPUP_WIDTH, this.CONSTANTS.POPUP_HEIGHT);
    if (popupWindow === null) {
      this.warn('Popup Window is null. This can happen if you are using IE');
      this._saveItem(this.CONSTANTS.STORAGE.ERROR, 'Error opening popup');
      this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION, 'Popup Window is null. This can happen if you are using IE');
      this._saveItem(this.CONSTANTS.STORAGE.LOGIN_ERROR, 'Popup Window is null. This can happen if you are using IE');
      if (this.callback) {
        this.callback(this._getItem(this.CONSTANTS.STORAGE.LOGIN_ERROR), null);
      }
      return;
    }
    let registeredRedirectUri;
    if (this.config.redirectUri.indexOf('#') === -1) {
      registeredRedirectUri = this.config.redirectUri;
    } else {
      registeredRedirectUri = this.config.redirectUri.split('#')[0];
    }
    const pollTimer = window.setInterval(() => {
      if (!popupWindow || popupWindow.closed || popupWindow.closed === undefined) {
        this._loginInProgress = false;
        window.clearInterval(pollTimer);
      }
      try {
        if (popupWindow.location.href.indexOf(registeredRedirectUri) !== -1) {
          if (this.isAngular) {
            window.location.hash = popupWindow.location.hash;
          } else {
            this.handleWindowCallback(popupWindow.location.hash, popupWindow.location.search);
          }
          window.clearInterval(pollTimer);
          this._loginInProgress = false;
          this.info('Closing popup window');
          popupWindow.close();
        }
      } catch (e) {
      }
    }, 20);
  }

  loginInProgress() {
    return this._loginInProgress;
  }

  _hasResource(key) {
    const keys = this._getItem(this.CONSTANTS.STORAGE.TOKEN_KEYS);
    return keys && !this._isEmpty(keys) && (keys.indexOf(key + this.CONSTANTS.RESOURCE_DELIMETER) > -1);
  }

  /**
   * Gets token for the specified resource from local storage cache
   * @param {string}   resource A URI that identifies the resource for which the token is valid.
   * @return {string} token if exists and not expired or null
   */
  getCachedToken(resource) {
    if (!this._hasResource(resource)) {
      return null;
    }

    const token = this._getItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + resource);
    const expired = this._getItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY + resource);

    // If expiration is within offset, it will force renew
    const offset = this.config.expireOffsetSeconds || 120;

    if (expired && (expired > this._now() + offset)) {
      return token;
    }
    this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + resource, '');
    this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY + resource, 0);
    return null;
  }

  /**
   * Retrieves and parse idToken from localstorage
   * @return {User} user object
   */
  getCachedUser() {
    if (this._user) {
      return this._user;
    }

    const idtoken = this._getItem(this.CONSTANTS.STORAGE.IDTOKEN);
    this._user = this._createUser(idtoken);
    return this._user;
  }

  registerCallback(expectedState, resource, callback) {
    this._activeRenewals[resource] = expectedState;
    if (!this.callBacksMappedToRenewStates[expectedState]) {
      this.callBacksMappedToRenewStates[expectedState] = [];
    }
    this.callBacksMappedToRenewStates[expectedState].push(callback);
    if (!this.callBackMappedToRenewStates[expectedState]) {
      this.callBackMappedToRenewStates[expectedState] = (message, token) => {
        for (let i = 0; i < this.callBacksMappedToRenewStates[expectedState].length; ++i) {
          try {
            this.callBacksMappedToRenewStates[expectedState][i](message, token);
          } catch (error) {
            this.warn(error);
          }
        }
        this._activeRenewals[resource] = null;
        this.callBacksMappedToRenewStates[expectedState] = null;
        this.callBackMappedToRenewStates[expectedState] = null;
      };
    }
  }

  /**
   * Acquires access token with hidden iframe
   * @param {string} resource  ResourceUri identifying the target resource
   * @param {string} callback  ResourceUri identifying the target resource
   */
  _renewToken(resource, callback) {
    // use iframe to try refresh token
    // use given resource to create new authz url
    this.info('renewToken is called for resource:' + resource);
    const frameHandle = this._addAuthFrame('authRenewFrame' + resource);
    const expectedState = this._guid() + '|' + resource;
    this.config.state = expectedState;
    // renew happens in iframe, so it keeps javascript context
    this._renewStates.push(expectedState);

    this.verbose('Renew token Expected state: ' + expectedState);
    let urlNavigate = this._getNavigateUrl('token', resource) + '&prompt=none';
    urlNavigate = this._addHintParameters(urlNavigate);

    this.registerCallback(expectedState, resource, callback);
    this.verbose('Navigate to:' + urlNavigate);
    this._saveItem(this.CONSTANTS.STORAGE.LOGIN_REQUEST, '');
    frameHandle.src = 'about:blank';
    this._loadFrameTimeout(urlNavigate, 'authRenewFrame' + resource, resource);
  }

  _renewIdToken(callback) {
    // use iframe to try refresh token
    this.info('renewIdToken is called');
    const frameHandle = this._addAuthFrame('authIdTokenFrame');
    const expectedState = this._guid() + '|' + this.config.clientId;
    this._idTokenNonce = this._guid();
    this._saveItem(this.CONSTANTS.STORAGE.NONCE_IDTOKEN, this._idTokenNonce);
    this.config.state = expectedState;
    // renew happens in iframe, so it keeps javascript context
    this._renewStates.push(expectedState);

    this.verbose('Renew Idtoken Expected state: ' + expectedState);
    let urlNavigate = this._getNavigateUrl(this.config.responseType, null) + '&prompt=none';
    urlNavigate = this._addHintParameters(urlNavigate);

    urlNavigate += '&nonce=' + encodeURIComponent(this._idTokenNonce);
    this.registerCallback(expectedState, this.config.clientId, callback);
    this.idTokenNonce = null;
    this.verbose('Navigate to:' + urlNavigate);
    this._saveItem(this.CONSTANTS.STORAGE.LOGIN_REQUEST, '');
    frameHandle.src = 'about:blank';
    this._loadFrameTimeout(urlNavigate, 'authIdTokenFrame', this.config.clientId);
  }

  _urlContainsQueryStringParameter(name, url) {
    // regex to detect pattern of a ? or & followed by the name parameter and an equals character
    const regex = new RegExp('[\\?&]' + name + '=');
    return regex.test(url);
  }

  // Calling _loadFrame but with a timeout to signal failure in loadframeStatus. Callbacks are left
  // registered when network errors occur and subsequent token requests for same resource are registered to the pending request
  _loadFrameTimeout(urlNavigation, frameName, resource) {
    // set iframe session to pending
    this.verbose('Set loading state to pending for: ' + resource);
    this._saveItem(this.CONSTANTS.STORAGE.RENEW_STATUS + resource, this.CONSTANTS.TOKEN_RENEW_STATUS_IN_PROGRESS);
    this._loadFrame(urlNavigation, frameName);
    setTimeout(() => {
      if (this._getItem(this.CONSTANTS.STORAGE.RENEW_STATUS + resource) === this.CONSTANTS.TOKEN_RENEW_STATUS_IN_PROGRESS) {
        // fail the iframe session if it's in pending state
        this.verbose('Loading frame has timed out after: ' + (this.CONSTANTS.LOADFRAME_TIMEOUT / 1000) + ' seconds for resource ' + resource);
        const expectedState = this._activeRenewals[resource];

        this._saveItem(this.CONSTANTS.STORAGE.RENEW_STATUS + resource, this.CONSTANTS.TOKEN_RENEW_STATUS_CANCELED);

        if (expectedState && this.callBackMappedToRenewStates[expectedState]) {
          this.callBackMappedToRenewStates[expectedState]('Token renewal operation failed due to timeout', null);
        }
      }
    }, this.CONSTANTS.LOADFRAME_TIMEOUT);
  }

  _loadFrame(urlNavigate, frameName) {
    // This trick overcomes iframe navigation in IE
    // IE does not load the page consistently in iframe
    this.info('LoadFrame: ' + frameName);
    const frameCheck = frameName;
    setTimeout(() => {
      const frameHandle = this._addAuthFrame(frameCheck);
      if (frameHandle.src === '' || frameHandle.src === 'about:blank') {
        frameHandle.src = urlNavigate;
        this._loadFrame(urlNavigate, frameCheck);
      }
    }, 500);
  }

  /**
   * Acquire token from cache if not expired and available. Acquires token from iframe if expired.
   * @param {string} resource  ResourceUri identifying the target resource
   * @param {function} callback The callback function
   */
  acquireToken(resource, callback) {
    if (this._isEmpty(resource)) {
      this.warn('resource is required');
      callback('resource is required', null);
      return;
    }

    const token = this.getCachedToken(resource);
    if (token) {
      this.info('Token is already in cache for resource:' + resource);
      callback(null, token);
      return;
    }

    if (!this._user) {
      this.warn('User login is required');
      callback('User login is required', null);
      return;
    }

    // refresh attept with iframe
    // Already renewing for this resource, callback when we get the token.
    if (this._activeRenewals[resource]) {
      // Active renewals contains the state for each renewal.
      this.registerCallback(this._activeRenewals[resource], resource, callback);
    } else if (resource === this.config.clientId) {
      // App uses idtoken to send to api endpoints
      // Default resource is tracked as clientid to store this token
      this.verbose('renewing idtoken');
      this._renewIdToken(callback);
    } else {
      this._renewToken(resource, callback);
    }
  }

  /**
   * Redirect the Browser to Azure AD Authorization endpoint
   * @param {string} urlNavigate The authorization request url
   */
  promptUser(urlNavigate) {
    if (urlNavigate) {
      this.info('Navigate to:' + urlNavigate);
      this.navigate(urlNavigate);
    } else {
      this.info('Navigate url is empty');
    }
  }

  /**
   * Clear cache items.
   */
  clearCache() {
    this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY, '');
    this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY, 0);
    this._saveItem(this.CONSTANTS.STORAGE.SESSION_STATE, '');
    this._saveItem(this.CONSTANTS.STORAGE.STATE_LOGIN, '');
    this._renewStates = [];
    this._saveItem(this.CONSTANTS.STORAGE.USERNAME, '');
    this._saveItem(this.CONSTANTS.STORAGE.IDTOKEN, '');
    this._saveItem(this.CONSTANTS.STORAGE.ERROR, '');
    this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION, '');
    let keys = this._getItem(this.CONSTANTS.STORAGE.TOKEN_KEYS);

    if (!this._isEmpty(keys)) {
      keys = keys.split(this.CONSTANTS.RESOURCE_DELIMETER);
      for (let i = 0; i < keys.length; i++) {
        this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + keys[i], '');
        this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY + keys[i], 0);
      }
    }
    this._saveItem(this.CONSTANTS.STORAGE.TOKEN_KEYS, '');
  }

  /**
   * Clear cache items for a resource.
   * @param {string} resource The resource
   */
  clearCacheForResource(resource) {
    this._saveItem(this.CONSTANTS.STORAGE.STATE_RENEW, '');
    this._saveItem(this.CONSTANTS.STORAGE.ERROR, '');
    this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION, '');
    if (this._hasResource(resource)) {
      this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + resource, '');
      this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY + resource, 0);
    }
  }

  /**
   * Logout user will redirect page to logout endpoint.
   * After logout, it will redirect to post_logout page if provided.
   */
  logOut() {
    this.clearCache();
    let logout = '';
    this._user = null;

    if (this.config.postLogoutRedirectUri) {
      logout = 'post_logout_redirect_uri=' + encodeURIComponent(this.config.postLogoutRedirectUri);
    }

    const urlNavigate = this.config.instance + 'logout?' + logout;
    this.info('Logout navigate to: ' + urlNavigate);
    this.promptUser(urlNavigate);
  }

  _isEmpty(str) {
    return (typeof str === 'undefined' || !str || str.length === 0);
  }

  /**
   * Gets a user profile
   * @param {requestCallback} callback The callback that handles the response.
   */
  getUser(callback) {
    // IDToken is first call
    if (typeof callback !== 'function') {
      throw new Error('callback is not a function');
    }

    // user in memory
    if (this._user) {
      callback(null, this._user);
      return;
    }

    // frame is used to get idtoken
    const idtoken = this._getItem(this.CONSTANTS.STORAGE.IDTOKEN);
    if (this._isEmpty(idtoken)) {
      this.warn('User information is not available');
      callback('User information is not available');
    } else {
      this.info('User exists in cache: ');
      this._user = this._createUser(idtoken);
      callback(null, this._user);
    }
  }

  _addHintParameters(urlNavigate) {
    // include hint params only if upn is present
    if (this._user && this._user.profile && this._user.profile.hasOwnProperty('upn')) {
      // add login_hint
      urlNavigate += '&login_hint=' + encodeURIComponent(this._user.profile.upn);

      // don't add domain_hint twice if user provided it in the extraQueryParameter value
      if (!this._urlContainsQueryStringParameter('domain_hint', urlNavigate) && this._user.profile.upn.indexOf('@') > -1) {
        const parts = this._user.profile.upn.split('@');
        // local part can include @ in quotes. Sending last part handles that.
        urlNavigate += '&domain_hint=' + encodeURIComponent(parts[parts.length - 1]);
      }
    }

    return urlNavigate;
  }

  _createUser(idToken) {
    let user = null;
    const parsedJson = this._extractIdToken(idToken);
    if (parsedJson && parsedJson.hasOwnProperty('aud')) {
      let audienceMatch = false;

      if (Array.isArray(parsedJson.aud)) {
        // If the ID Token contains multiple audiences then an azp claim must be present and equal to the client id.
        if (parsedJson.hasOwnProperty('azp') && parsedJson.azp.toLowerCase() === this.config.clientId.toLowerCase()) {
          for (let i = 0; i < parsedJson.aud.length; i++) {
            if (parsedJson.aud[i].toLowerCase() === this.config.clientId.toLowerCase()) {
              audienceMatch = true;
              break;
            }
          }
        }
      } else {
        audienceMatch = (parsedJson.aud.toLowerCase() === this.config.clientId.toLowerCase());
      }

      if (audienceMatch) {
        user = {
          userName: '',
          profile: parsedJson
        };

        if (parsedJson.hasOwnProperty('upn')) {
          user.userName = parsedJson.upn;
        } else if (parsedJson.hasOwnProperty('email')) {
          user.userName = parsedJson.email;
        } else if (parsedJson.hasOwnProperty('sub')) {
          user.userName = parsedJson.sub;
        }
      } else {
        this.warn('IdToken has invalid aud/azp field');
      }
    }

    return user;
  }

  _getHash(hash) {
    if (hash.indexOf('#/') > -1) {
      hash = hash.substring(hash.indexOf('#/') + 2);
    } else if (hash.indexOf('#') > -1) {
      hash = hash.substring(1);
    }

    return hash;
  }

  _getSearch(search) {
    if (search.indexOf('?') > -1) {
      search = search.substring(1);
    }

    return search;
  }

  _getParameters(hash, search) {
    let parameters = {};

    if (hash) {
      hash = this._getHash(hash);
      parameters = this._deserialize(hash);
    }

    if (search) {
      search = this._getSearch(search);
      const searchParameters = this._deserialize(search);
      parameters = this._extend(parameters, searchParameters);
    }

    return parameters;
  }

  _extend(obj, src) {
    for (const key in src) {
      if (src.hasOwnProperty(key)) {
        obj[key] = src[key];
      }
    }
    return obj;
  }

  /**
   * Checks if hash contains access token or id token or error_description
   * @param {string} hash  -  Hash passed from redirect page
   * @param {string} search  -  Search passed from redirect page
   * @return {boolean} exists if all the parameters exist
   */
  isCallback(hash, search) {
    const parameters = this._getParameters(hash, search);

    return parameters.hasOwnProperty(this.CONSTANTS.ERROR_DESCRIPTION) ||
      parameters.hasOwnProperty(this.CONSTANTS.ACCESS_TOKEN) ||
      parameters.hasOwnProperty(this.CONSTANTS.ID_TOKEN);
  }

  /**
   * Gets login error
   * @return {string} error message related to login
   */
  getLoginError() {
    return this._getItem(this.CONSTANTS.STORAGE.LOGIN_ERROR);
  }

  /**
   * Gets requestInfo from given hash.
   * @param {string} hash  -  Hash passed from redirect page
   * @param {string} search  -  Search passed from redirect page
   * @return {string} error message related to login
   */
  getRequestInfo(hash, search) {
    const parameters = this._getParameters(hash, search);
    const requestInfo = {
      valid: false,
      parameters: {},
      stateMatch: false,
      stateResponse: '',
      requestType: this.REQUEST_TYPE.UNKNOWN
    };

    if (parameters) {
      requestInfo.parameters = parameters;
      if (parameters.hasOwnProperty(this.CONSTANTS.ERROR_DESCRIPTION) ||
        parameters.hasOwnProperty(this.CONSTANTS.ACCESS_TOKEN) ||
        parameters.hasOwnProperty(this.CONSTANTS.ID_TOKEN)) {
        requestInfo.valid = true;

        // which call
        let stateResponse = '';
        if (parameters.hasOwnProperty('state')) {
          this.verbose('State: ' + parameters.state);
          stateResponse = parameters.state;
        } else {
          this.warn('No state returned');
          return requestInfo;
        }

        requestInfo.stateResponse = stateResponse;

        // async calls can fire iframe and login request at the same time if developer does not use the API as expected
        // incoming callback needs to be looked up to find the request type
        if (stateResponse === this._getItem(this.CONSTANTS.STORAGE.STATE_LOGIN)) {
          requestInfo.requestType = this.REQUEST_TYPE.LOGIN;
          requestInfo.stateMatch = true;
          return requestInfo;
        }

        // external api requests may have many renewtoken requests for different resource
        if (!requestInfo.stateMatch && window.parent && window.parent.AuthenticationContext) {
          const statesInParentContext = window.parent.AuthenticationContext._renewStates;
          for (let i = 0; i < statesInParentContext.length; i++) {
            if (statesInParentContext[i] === requestInfo.stateResponse) {
              requestInfo.requestType = this.REQUEST_TYPE.RENEW_TOKEN;
              requestInfo.stateMatch = true;
              break;
            }
          }
        }
      }
    }

    return requestInfo;
  }

  _getResourceFromState(state) {
    if (state) {
      const splitIndex = state.indexOf('|');
      if (splitIndex > -1 && splitIndex + 1 < state.length) {
        return state.substring(splitIndex + 1);
      }
    }

    return '';
  }

  /**
   * Saves token from hash that is received from redirect.
   * @param {string} requestInfo Hash passed from redirect page
   */
  saveTokenFromHash(requestInfo) {
    this.info('State status:' + requestInfo.stateMatch + '; Request type:' + requestInfo.requestType);
    this._saveItem(this.CONSTANTS.STORAGE.ERROR, '');
    this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION, '');

    let resource = this._getResourceFromState(requestInfo.stateResponse);

    // Record error
    if (requestInfo.parameters.hasOwnProperty(this.CONSTANTS.ERROR_DESCRIPTION)) {
      this.info('Error :' + requestInfo.parameters.error + '; Error description:' + requestInfo.parameters[this.CONSTANTS.ERROR_DESCRIPTION]);
      this._saveItem(this.CONSTANTS.STORAGE.ERROR, requestInfo.parameters.error);
      this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION, requestInfo.parameters[this.CONSTANTS.ERROR_DESCRIPTION]);

      if (requestInfo.requestType === this.REQUEST_TYPE.LOGIN) {
        this._loginInProgress = false;
        this._saveItem(this.CONSTANTS.STORAGE.LOGIN_ERROR, requestInfo.parameters.error_description);
      }
    } else if (requestInfo.stateMatch) {
      // record tokens to storage if exists
      this.info('State is right');
      if (requestInfo.parameters.hasOwnProperty(this.CONSTANTS.SESSION_STATE)) {
        this._saveItem(this.CONSTANTS.STORAGE.SESSION_STATE, requestInfo.parameters[this.CONSTANTS.SESSION_STATE]);
      }

      let keys;

      if (requestInfo.parameters.hasOwnProperty(this.CONSTANTS.ACCESS_TOKEN)) {
        this.info('Fragment has access token');

        if (!this._hasResource(resource)) {
          keys = this._getItem(this.CONSTANTS.STORAGE.TOKEN_KEYS) || '';
          this._saveItem(this.CONSTANTS.STORAGE.TOKEN_KEYS, keys + resource + this.CONSTANTS.RESOURCE_DELIMETER);
        }
        // save token with related resource
        this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + resource, requestInfo.parameters[this.CONSTANTS.ACCESS_TOKEN]);
        this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY + resource, this._expiresIn(requestInfo.parameters[this.CONSTANTS.EXPIRES_IN]));
      }

      if (requestInfo.parameters.hasOwnProperty(this.CONSTANTS.ID_TOKEN)) {
        this.info('Fragment has id token');
        this._loginInProgress = false;

        this._user = this._createUser(requestInfo.parameters[this.CONSTANTS.ID_TOKEN]);

        if (this._user && this._user.profile) {
          if (this._user.profile.nonce === this._getItem(this.CONSTANTS.STORAGE.NONCE_IDTOKEN)) {
            this._saveItem(this.CONSTANTS.STORAGE.IDTOKEN, requestInfo.parameters[this.CONSTANTS.ID_TOKEN]);

            // Save idtoken as access token for app itself
            resource = this.config.loginResource ? this.config.loginResource : this.config.clientId;

            if (!this._hasResource(resource)) {
              keys = this._getItem(this.CONSTANTS.STORAGE.TOKEN_KEYS) || '';
              this._saveItem(this.CONSTANTS.STORAGE.TOKEN_KEYS, keys + resource + this.CONSTANTS.RESOURCE_DELIMETER);
            }
            this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + resource, requestInfo.parameters[this.CONSTANTS.ID_TOKEN]);
            this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY + resource, this._user.profile.exp);
          } else {
            this._user = null;
            this._saveItem(this.CONSTANTS.STORAGE.LOGIN_ERROR, 'Nonce is not same as ' + this._idTokenNonce);
          }
        } else {
          this._saveItem(this.CONSTANTS.STORAGE.ERROR, 'invalid id_token');
          this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION, 'Invalid id_token. id_token: ' + requestInfo.parameters[this.CONSTANTS.ID_TOKEN]);
        }
      }
    } else {
      this._saveItem(this.CONSTANTS.STORAGE.ERROR, 'Invalid_state');
      this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION, 'Invalid_state. state: ' + requestInfo.stateResponse);
    }
    this._saveItem(this.CONSTANTS.STORAGE.RENEW_STATUS + resource, this.CONSTANTS.TOKEN_RENEW_STATUS_COMPLETED);
  }

  /**
   * Gets resource for given endpoint if mapping is provided with config.
   * @param {string} endpoint API endpoint
   * @return {string} resource for this API endpoint
   */
  getResourceForEndpoint(endpoint) {
    if (this.config && this.config.endpoints) {
      for (const configEndpoint in this.config.endpoints) {
        // configEndpoint is like /api/Todo requested endpoint can be /api/Todo/1
        if (endpoint.indexOf(configEndpoint) > -1) {
          return this.config.endpoints[configEndpoint];
        }
      }
    }

    // default resource will be clientid if nothing specified
    // App will use idtoken for calls to itself
    // check if it's staring from http or https, needs to match with app host
    if (endpoint.indexOf('http://') > -1 || endpoint.indexOf('https://') > -1) {
      if (this._getHostFromUri(endpoint) === this._getHostFromUri(this.config.redirectUri)) {
        return this.config.loginResource;
      }
    } else {
      // in angular level, the url for $http interceptor call could be relative url,
      // if it's relative call, we'll treat it as app backend call.
      // if user specified list of anonymous endpoints, no need to send token to these endpoints, return null.
      if (this.config && this.config.anonymousEndpoints) {
        for (let i = 0; i < this.config.anonymousEndpoints.length; i++) {
          if (endpoint.indexOf(this.config.anonymousEndpoints[i]) > -1) {
            return null;
          }
        }
      }
      // all other app's backend calls are secured.
      return this.config.loginResource;
    }

    // if not the app's own backend or not a domain listed in the endpoints structure
    return null;
  }

  _getHostFromUri(uri) {
    // remove http:// or https:// from uri
    let extractedUri = String(uri).replace(/^(https?:)\/\//, '');

    extractedUri = extractedUri.split('/')[0];
    return extractedUri;
  }

  /* exported  oauth2Callback */
  handleWindowCallback(hash, search) {
    // This is for regular javascript usage for redirect handling
    // need to make sure this is for callback
    if (!hash) {
      hash = window.location.hash;
    }

    if (!search) {
      search = window.location.search;
    }

    if (this.isCallback(hash, search)) {
      const requestInfo = this.getRequestInfo(hash, search);
      this.info('Returned from redirect url');
      this.saveTokenFromHash(requestInfo);
      let callback = null;
      if ((requestInfo.requestType === this.REQUEST_TYPE.RENEW_TOKEN) && this.isIframe()) {
        // iframe call but same single page
        this.verbose('Window is in iframe');
        callback = window.parent.AuthenticationContext.callBackMappedToRenewStates[requestInfo.stateResponse];
        if (callback) {
          callback(this._getItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters[this.CONSTANTS.ACCESS_TOKEN] || requestInfo.parameters[this.CONSTANTS.ID_TOKEN]);
        }
        return;
      } else if (requestInfo.requestType === this.REQUEST_TYPE.LOGIN) {
        callback = this.callback;
        if (callback) {
          callback(this._getItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters[this.CONSTANTS.ID_TOKEN]);
        }
      }
      // No need to redirect user in case of popup
      if (!this.popUp) {
        this.navigate(this._getItem(this.CONSTANTS.STORAGE.LOGIN_REQUEST));
      }
    }
  }

  _getNavigateUrl(responseType, resource) {
    let urlNavigate = this.config.instance + 'authorize' + this._serialize(responseType, this.config, resource) + this._addLibMetadata();
    if (this.config.scope) {
      urlNavigate += '&scope=' + encodeURIComponent(this.config.scope);
    }
    this.info('Navigate url:' + urlNavigate);
    return urlNavigate;
  }

  _extractIdToken(encodedIdToken) {
    // id token will be decoded to get the username
    const decodedToken = this._decodeJwt(encodedIdToken);
    if (!decodedToken) {
      return null;
    }

    try {
      const base64IdToken = decodedToken.JWSPayload;
      const base64Decoded = this._base64DecodeStringUrlSafe(base64IdToken);
      if (!base64Decoded) {
        this.info('The returned id_token could not be base64 url safe decoded.');
        return null;
      }

      return JSON.parse(base64Decoded);
    } catch (err) {
      this.error('The returned id_token could not be decoded', err);
    }

    return null;
  }

  _base64DecodeStringUrlSafe(base64IdToken) {
    // html5 should support atob function for decoding
    base64IdToken = base64IdToken.replace(/-/g, '+').replace(/_/g, '/');
    if (window.atob) {
      return decodeURIComponent(escape(window.atob(base64IdToken)));
    }
    return decodeURIComponent(escape(this._decode(base64IdToken)));
  }

  // Take https://cdnjs.cloudflare.com/ajax/libs/Base64/0.3.0/base64.js and https://en.wikipedia.org/wiki/Base64 as reference.
  _decode(base64IdToken) {
    const codes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    base64IdToken = String(base64IdToken).replace(/[=]+$/, '');

    const length = base64IdToken.length;
    if (length % 4 === 1) {
      throw new Error('The token to be decoded is not correctly encoded.');
    }

    let h1, h2, h3, h4, bits, c1, c2, c3;
    let decoded = '';
    for (let i = 0; i < length; i += 4) {
      // Every 4 base64 encoded character will be converted to 3 byte string, which is 24 bits
      // then 6 bits per base64 encoded character
      h1 = codes.indexOf(base64IdToken.charAt(i));
      h2 = codes.indexOf(base64IdToken.charAt(i + 1));
      h3 = codes.indexOf(base64IdToken.charAt(i + 2));
      h4 = codes.indexOf(base64IdToken.charAt(i + 3));

      // For padding, if last two are '='
      if (i + 2 === length - 1) {
        bits = h1 << 18 | h2 << 12 | h3 << 6;
        c1 = bits >> 16 & 255;
        c2 = bits >> 8 & 255;
        decoded += String.fromCharCode(c1, c2);
        break;
      } else if (i + 1 === length - 1) { // if last one is '='
        bits = h1 << 18 | h2 << 12;
        c1 = bits >> 16 & 255;
        decoded += String.fromCharCode(c1);
        break;
      }

      bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

      // then convert to 3 byte chars
      c1 = bits >> 16 & 255;
      c2 = bits >> 8 & 255;
      c3 = bits & 255;

      decoded += String.fromCharCode(c1, c2, c3);
    }

    return decoded;
  }

    // Auth.node js crack function
  _decodeJwt(jwtToken) {
    if (this._isEmpty(jwtToken)) {
      return null;
    }

    const idTokenPartsRegex = /^([^\.\s]*)\.([^\.\s]+)\.([^\.\s]*)$/;

    const matches = idTokenPartsRegex.exec(jwtToken);
    if (!matches || matches.length < 4) {
      this.warn('The returned id_token is not parseable.');
      return null;
    }

    const crackedToken = {
      header: matches[1],
      JWSPayload: matches[2],
      JWSSig: matches[3]
    };

    return crackedToken;
  }

  _convertUrlSafeToRegularBase64EncodedString(str) {
    return str.replace('-', '+').replace('_', '/');
  }

  _serialize(responseType, obj, resource) {
    const str = [];
    if (obj !== null) {
      str.push('?response_type=' + encodeURIComponent(responseType));
      str.push('client_id=' + encodeURIComponent(obj.clientId));
      if (resource) {
        str.push('resource=' + encodeURIComponent(resource));
      }

      str.push('redirect_uri=' + encodeURIComponent(obj.redirectUri));
      str.push('state=' + encodeURIComponent(obj.state));

      if (obj.hasOwnProperty('slice')) {
        str.push('slice=' + encodeURIComponent(obj.slice));
      }

      if (obj.hasOwnProperty('extraQueryParameter')) {
        str.push(obj.extraQueryParameter);
      }

      const correlationId = obj.correlationId ? obj.correlationId : this._guid();
      str.push('client-request-id=' + encodeURIComponent(correlationId));
    }

    return str.join('&');
  }

  _deserialize(query) {
    const pl = /\+/g; // Regex for replacing addition symbol with a space
    const search = /([^&=]+)=([^&]*)/g;
    const decode = (s) => {
      return decodeURIComponent(s.replace(pl, ' '));
    };
    const obj = {};
    let match = search.exec(query);
    while (match) {
      obj[decode(match[1])] = decode(match[2]);
      match = search.exec(query);
    }

    return obj;
  }

  _decimalToHex(number) {
    let hex = number.toString(16);
    while (hex.length < 2) {
      hex = '0' + hex;
    }
    return hex;
  }

  _guid() {
    // RFC4122: The version 4 UUID is meant for generating UUIDs from truly-random or
    // pseudo-random numbers.
    // The algorithm is as follows:
    //     Set the two most significant bits (bits 6 and 7) of the
    //        clock_seq_hi_and_reserved to zero and one, respectively.
    //     Set the four most significant bits (bits 12 through 15) of the
    //        time_hi_and_version field to the 4-bit version number from
    //        Section 4.1.3. Version4
    //     Set all the other bits to randomly (or pseudo-randomly) chosen
    //     values.
    // UUID                   = time-low "-" time-mid "-"time-high-and-version "-"clock-seq-reserved and low(2hexOctet)"-" node
    // time-low               = 4hexOctet
    // time-mid               = 2hexOctet
    // time-high-and-version  = 2hexOctet
    // clock-seq-and-reserved = hexOctet:
    // clock-seq-low          = hexOctet
    // node                   = 6hexOctet
    // Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    // y could be 1000, 1001, 1010, 1011 since most significant two bits needs to be 10
    // y values are 8, 9, A, B
    if (this.crypto && this.crypto.getRandomValues) {
      const buffer = new Uint8Array(16);
      this.crypto.getRandomValues(buffer);
      // buffer[6] and buffer[7] represents the time_hi_and_version field. We will set the four most significant bits (4 through 7) of buffer[6] to represent decimal number 4 (UUID version number).
      buffer[6] |= 0x40; // buffer[6] | 01000000 will set the 6 bit to 1.
      buffer[6] &= 0x4f; // buffer[6] & 01001111 will set the 4, 5, and 7 bit to 0 such that bits 4-7 == 0100 = "4".
      // buffer[8] represents the clock_seq_hi_and_reserved field. We will set the two most significant bits (6 and 7) of the clock_seq_hi_and_reserved to zero and one, respectively.
      buffer[8] |= 0x80; // buffer[8] | 10000000 will set the 7 bit to 1.
      buffer[8] &= 0xbf; // buffer[8] & 10111111 will set the 6 bit to 0.
      return this._decimalToHex(buffer[0]) + this._decimalToHex(buffer[1]) + this._decimalToHex(buffer[2]) + this._decimalToHex(buffer[3]) + '-' + this._decimalToHex(buffer[4]) + this._decimalToHex(buffer[5]) + '-' + this._decimalToHex(buffer[6]) + this._decimalToHex(buffer[7]) + '-' +
             this._decimalToHex(buffer[8]) + this._decimalToHex(buffer[9]) + '-' + this._decimalToHex(buffer[10]) + this._decimalToHex(buffer[11]) + this._decimalToHex(buffer[12]) + this._decimalToHex(buffer[13]) + this._decimalToHex(buffer[14]) + this._decimalToHex(buffer[15]);
    }
    const guidHolder = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    const hex = '0123456789abcdef';
    let r = 0;
    let guidResponse = "";
    for (let i = 0; i < 36; i++) {
      if (guidHolder[i] !== '-' && guidHolder[i] !== '4') {
                  // each x and y needs to be random
        r = Math.random() * 16 | 0;
      }
      if (guidHolder[i] === 'x') {
        guidResponse += hex[r];
      } else if (guidHolder[i] === 'y') {
                  // clock-seq-and-reserved first hex is filtered and remaining hex values are random
        r &= 0x3; // bit and with 0011 to set pos 2 to zero ?0??
        r |= 0x8; // set pos 3 to 1 as 1???
        guidResponse += hex[r];
      } else {
        guidResponse += guidHolder[i];
      }
    }
    return guidResponse;
  }

  _expiresIn(expires) {
    return this._now() + parseInt(expires, 10);
  }

  _now() {
    return Math.round(new Date().getTime() / 1000.0);
  }

  _addAuthFrame(iframeId) {
    if (typeof iframeId === 'undefined') {
      return;
    }

    this.info('Add auth frame to document:' + iframeId);
    let authFrame = document.getElementById(iframeId);

    if (!authFrame) {
      if (document.createElement && document.documentElement &&
                (window.opera || window.navigator.userAgent.indexOf('MSIE 5.0') === -1)) {
        const ifr = document.createElement('iframe');
        ifr.setAttribute('id', iframeId);
        ifr.style.visibility = 'hidden';
        ifr.style.position = 'absolute';
        ifr.style.width = ifr.style.height = ifr.borderWidth = '0px';

        authFrame = document.getElementsByTagName('body')[0].appendChild(ifr);
      } else if (document.body && document.body.insertAdjacentHTML) {
        document.body.insertAdjacentHTML('beforeEnd', '<iframe name="' + iframeId + '" id="' + iframeId + '" style="display:none"></iframe>');
      }
      if (window.frames && window.frames[iframeId]) {
        authFrame = window.frames[iframeId];
      }
    }

    return authFrame;
  }

  _saveItem(key, obj) {
    if (this.config && this.config.cacheLocation && this.config.cacheLocation === 'localStorage') {
      if (!this._supportsLocalStorage()) {
        this.info('Local storage is not supported');
        return false;
      }

      localStorage.setItem(key, obj);

      return true;
    }

    // Default as session storage
    if (!this._supportsSessionStorage()) {
      this.info('Session storage is not supported');
      return false;
    }

    sessionStorage.setItem(key, obj);
    return true;
  }

  _getItem(key) {
    if (this.config && this.config.cacheLocation && this.config.cacheLocation === 'localStorage') {
      if (!this._supportsLocalStorage()) {
        this.info('Local storage is not supported');
        return null;
      }

      return localStorage.getItem(key);
    }

    // Default as session storage
    if (!this._supportsSessionStorage()) {
      this.info('Session storage is not supported');
      return null;
    }

    return sessionStorage.getItem(key);
  }

  _supportsLocalStorage() {
    try {
      return 'localStorage' in window && window.localStorage;
    } catch (e) {
      return false;
    }
  }

  _supportsSessionStorage() {
    try {
      return 'sessionStorage' in window && window.sessionStorage;
    } catch (e) {
      return false;
    }
  }

  _cloneConfig(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    const copy = {};
    for (const attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = obj[attr];
      }
    }
    return copy;
  }

  _addLibMetadata() {
    // x-client-SKU
    // x-client-Ver
    return '&x-client-SKU=Js&x-client-Ver=' + this._libVersion();
  }

  log(level, message, error) {
    if (level <= Logging.level) {
      const timestamp = new Date().toUTCString();
      let formattedMessage = '';

      if (this.config.correlationId) {
        formattedMessage = timestamp + ':' + this.config.correlationId + '-' + this._libVersion() + '-' + this.CONSTANTS.LEVEL_STRING_MAP[level] + ' ' + message;
      } else {
        formattedMessage = timestamp + ':' + this._libVersion() + '-' + this.CONSTANTS.LEVEL_STRING_MAP[level] + ' ' + message;
      }

      if (error) {
        formattedMessage += '\nstack:\n' + error.stack;
      }

      Logging.log(formattedMessage);
    }
  }

  error(message, error) {
    this.log(this.CONSTANTS.LOGGING_LEVEL.ERROR, message, error);
  }

  warn(message) {
    this.log(this.CONSTANTS.LOGGING_LEVEL.WARN, message, null);
  }

  info(message) {
    this.log(this.CONSTANTS.LOGGING_LEVEL.INFO, message, null);
  }

  verbose(message) {
    this.log(this.CONSTANTS.LOGGING_LEVEL.VERBOSE, message, null);
  }

  navigate(url) {
    window.location.replace(url);
  }

  isIframe() {
    return window.parent && window.parent !== window;
  }

  open(url, name, features) {
    return window.open(url, name, features);
  }

  _libVersion() {
    return '1.0.12';
  }
}

global.Logging = {
  level: 0,
  log: (message) => {}
};
