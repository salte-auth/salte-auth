const sinon = require('sinon');
const atob = require('atob');
import AuthModule from '../../src/salte-auth.js';
global.window = {};

describe('Auth', () => {
  let auth;
  window.location = {
    hash: '#hash',
    href: 'href',
    replace: sinon.spy()
  };
  window.localStorage = {};
  window.sessionStorage = {};
  window.atob = atob;
  window.innerWidth = 100;
  window.innerHeight = 100;

  const mockFrames = {};

  const documentMock = {
    getElementById: function(frameId) {
      if (!mockFrames[frameId]) {
        mockFrames[frameId] = { src: 'start' };
      }
      return mockFrames[frameId];
    }
  };

  const angularMock = {};
  const conf = { loginResource: 'defaultResource', instance: 'https://login.microsoftonline.com/tenant/oauth2/', clientId: 'e9a5a8b6-8af7-4719-9821-0deef255f68e' };
  const STORAGE_PREFIX = 'auth';
  const STORAGE_ACCESS_TOKEN_KEY = STORAGE_PREFIX + '.access.token.key';
  const STORAGE_EXPIRATION_KEY = STORAGE_PREFIX + '.expiration.key';
  const STORAGE_TOKEN_KEYS = STORAGE_PREFIX + '.token.keys';
  const RESOURCE1 = 'token.resource1';
  const SECONDS_TO_EXPIRE = 3600;
  const IDTOKEN_MOCK = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVUa0d0S1JrZ2FpZXpFWTJFc0xDMmdPTGpBNCJ9.eyJhdWQiOiJlOWE1YThiNi04YWY3LTQ3MTktOTgyMS0wZGVlZjI1NWY2OGUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLXBwZS5uZXQvNTJkNGIwNzItOTQ3MC00OWZiLTg3MjEtYmMzYTFjOTkxMmExLyIsImlhdCI6MTQxMTk1OTAwMCwibmJmIjoxNDExOTU5MDAwLCJleHAiOjE0MTE5NjI5MDAsInZlciI6IjEuMCIsInRpZCI6IjUyZDRiMDcyLTk0NzAtNDlmYi04NzIxLWJjM2ExYzk5MTJhMSIsImFtciI6WyJwd2QiXSwib2lkIjoiZmEzYzVmYTctN2Q5OC00Zjk3LWJmYzQtZGJkM2E0YTAyNDMxIiwidXBuIjoidXNlckBvYXV0aGltcGxpY2l0LmNjc2N0cC5uZXQiLCJ1bmlxdWVfbmFtZSI6InVzZXJAb2F1dGhpbXBsaWNpdC5jY3NjdHAubmV0Iiwic3ViIjoiWTdUbXhFY09IUzI0NGFHa3RjbWpicnNrdk5tU1I4WHo5XzZmbVc2NXloZyIsImZhbWlseV9uYW1lIjoiYSIsImdpdmVuX25hbWUiOiJ1c2VyIiwibm9uY2UiOiI4MGZmYTkwYS1jYjc0LTRkMGYtYTRhYy1hZTFmOTNlMzJmZTAiLCJwd2RfZXhwIjoiNTc3OTkxMCIsInB3ZF91cmwiOiJodHRwczovL3BvcnRhbC5taWNyb3NvZnRvbmxpbmUuY29tL0NoYW5nZVBhc3N3b3JkLmFzcHgifQ.WHsl8TH1rQ3dQbRkV0TS6GBVAxzNOpG3nGG6mpEBCwAOCbyW6qRsSoo4qq8I5IGyerDf2cvcS-zzatHEROpRC9dcpwkRm6ta5dFZuouFyZ_QiYVKSMwfzEC_FI-6p7eT8gY6FbV51bp-Ah_WKJqEmaXv-lqjIpgsMGeWDgZRlB9cPODXosBq-PEk0q27Be-_A-KefQacJuWTX2eEhECLyuAu-ETVJb7s19jQrs_LJXz_ISib4DdTKPa7XTBDJlVGdCI18ctB67XwGmGi8MevkeKqFI8dkykTxeJ0MXMmEQbE6Fw-gxmP7uJYbZ61Jqwsw24zMDMeXatk2VWMBPCuhA';
  const STATE = '33333333-3333-4333-b333-333333333333';
  const SESSION_STATE = '451c6916-27cf-4eae-81cd-accf96126398';
  const VALID_URLFRAGMENT = 'id_token=' + IDTOKEN_MOCK + '&state=' + STATE + '&session_state=' + SESSION_STATE;
  const INVALID_URLFRAGMENT = 'id_token' + IDTOKEN_MOCK + '&state=' + STATE + '&session_state=' + SESSION_STATE;
  const storageFake = (function() {
    let store = {};
    return {
      getItem: (key) => store[key],
      setItem: (key, value) => {
        if (typeof value !== 'undefined') {
          store[key] = value;
        }
      },
      clear: () => {
        store = {};
      },
      storeVerify: () => store
    };
  })();

  beforeEach(() => {
    // one item in cache
    storageFake.clear();
    storageFake.setItem(STORAGE_ACCESS_TOKEN_KEY + RESOURCE1, 'access_token_in_cache' + RESOURCE1);
    global.Math.random = sinon.stub().returns(0.2);
    global.Math.round = sinon.stub().returns(1000);
    const secondsNow = Math.round(0);
    storageFake.setItem(STORAGE_EXPIRATION_KEY + RESOURCE1, secondsNow + SECONDS_TO_EXPIRE); // seconds to expire

    // add key
    storageFake.setItem(STORAGE_TOKEN_KEYS, RESOURCE1 + '|');

    window.localStorage = storageFake;
    window.sessionStorage = storageFake;

    // Init auth
    global.window = window;
    global.localStorage = storageFake;
    global.sessionStorage = storageFake;
    global.document = documentMock;
    global.angular = angularMock;

    auth = new AuthModule(conf);
    auth._user = null;
    auth._renewStates = [];
    auth._activeRenewals = {};
    auth.CONSTANTS.LOADFRAME_TIMEOUT = 800;
  });

  it('Verifies that AuthenticationContext exists on the global scope.', () => {
    expect(window.AuthenticationContext).not.toBeUndefined();
  });

  it('gets specific resource for defined endpoint mapping', () => {
    auth.config.endpoints = { a: 'resource for a' };
    expect(auth.getResourceForEndpoint('a')).toBe('resource for a');
    expect(auth.getResourceForEndpoint('b')).toBe(auth.config.loginResource);
  });

  it('gets default resource for empty endpoint mapping', () => {
    auth.config.endpoints = null;
    expect(auth.getResourceForEndpoint('a')).toBe('defaultResource');
    expect(auth.getResourceForEndpoint('b')).toBe('defaultResource');
  });

  it('gets null resource for annonymous endpoints', () => {
    auth.config.anonymousEndpoints = ['app/views'];
    expect(auth.getResourceForEndpoint('app/views')).toBe(null);
    expect(auth.getResourceForEndpoint('app/views/abc')).toBe(null);
    expect(auth.getResourceForEndpoint('default/app/views/abc')).toBe(null);
    expect(auth.getResourceForEndpoint('app/home')).toBe('defaultResource');
  });

  it('says token expired', () => {
    auth.config.expireOffsetSeconds = SECONDS_TO_EXPIRE - 100;
    expect(auth.getCachedToken(RESOURCE1)).toEqual('access_token_in_cache' + RESOURCE1);

    auth.config.expireOffsetSeconds = SECONDS_TO_EXPIRE;
    expect(auth.getCachedToken(RESOURCE1)).toBe(null);

    auth.config.expireOffsetSeconds = SECONDS_TO_EXPIRE + 1;
    expect(auth.getCachedToken(RESOURCE1)).toBe(null);
  });

  it('gets cache username', () => {
    storageFake.setItem(auth.CONSTANTS.STORAGE.IDTOKEN, IDTOKEN_MOCK);
    expect(auth.getCachedUser().userName).toBe('user@oauthimplicit.ccsctp.net');
  });

  it('navigates user to login by default', () => {
    storageFake.setItem(auth.CONSTANTS.STORAGE.USERNAME, 'test user');
    auth.config.displayCall = null;
    auth.config.clientId = 'client';
    auth.config.redirectUri = 'contoso_site';
    sinon.spy(auth, 'promptUser');
    auth.login();
    expect(auth.promptUser.calledWith(conf.instance + 'authorize?response_type=id_token&client_id=client&redirect_uri=contoso_site&state=33333333-3333-4333-b333-333333333333' +
      '&client-request-id=33333333-3333-4333-b333-333333333333' + auth._addLibMetadata() + '&nonce=33333333-3333-4333-b333-333333333333')).toEqual(true);
    expect(auth.config.state).toBe('33333333-3333-4333-b333-333333333333');
  });

  it('sets loginprogress to true for login', () => {
    storageFake.setItem(auth.CONSTANTS.STORAGE.USERNAME, 'test user');
    auth.config.displayCall = null;
    auth.config.clientId = 'client';
    auth.config.redirectUri = 'contoso_site';
    auth.login();
    expect(auth.loginInProgress()).toBe(true);
  });

  it('calls displaycall if given for login', () => {
    storageFake.setItem(auth.CONSTANTS.STORAGE.USERNAME, 'test user');
    auth._loginInProgress = false;
    auth.config.clientId = 'client';
    auth.config.redirectUri = 'contoso_site';
    auth.config.displayCall = sinon.spy();
    spyOn(auth.config, 'displayCall');
    auth.login();
    expect(auth.config.displayCall).toHaveBeenCalledWith(conf.instance + 'authorize?response_type=id_token&client_id=client&redirect_uri=contoso_site&state=33333333-3333-4333-b333-333333333333' +
      '&client-request-id=33333333-3333-4333-b333-333333333333' +
      auth._addLibMetadata() +
      '&nonce=33333333-3333-4333-b333-333333333333');
    expect(auth.config.state).toBe('33333333-3333-4333-b333-333333333333');
  });

  it('returns from cache for auto renewable if not expired', () => {
    auth.config.expireOffsetSeconds = SECONDS_TO_EXPIRE - 100;
    let token = '';
    const callback = (valErr, valToken) => {
      token = valToken;
    };
    auth.acquireToken(RESOURCE1, callback);
    expect(token).toBe('access_token_in_cache' + RESOURCE1);
  });

  it('returns error for acquireToken without resource', () => {
    auth.config.expireOffsetSeconds = SECONDS_TO_EXPIRE - 100;
    let err = '';
    const callback = (valErr, valToken) => {
      err = valErr;
    };
    auth.acquireToken(null, callback);
    expect(err).toBe('resource is required');
  });

  it('attempts to renew if token expired and renew is allowed', (done) => {
    auth.config.redirectUri = 'contoso_site';
    auth.config.clientId = 'client';
    auth.config.expireOffsetSeconds = SECONDS_TO_EXPIRE + 100;
    auth._renewStates = [];
    auth._user = { profile: { upn: 'test@testuser.com' }, userName: 'test@domain.com' };
    auth.acquireToken(RESOURCE1, sinon.spy());
    expect(auth.callback).toBe(null);
    expect(storageFake.getItem(auth.CONSTANTS.STORAGE.LOGIN_REQUEST)).toBe('');
    expect(auth._renewStates.length).toBe(1);
        // Wait for initial timeout load
    setTimeout(() => {
      expect(mockFrames['authRenewFrame' + RESOURCE1].src).toBe(conf.instance + 'authorize?response_type=token&client_id=client&resource=' + RESOURCE1 +
        '&redirect_uri=contoso_site&state=33333333-3333-4333-b333-333333333333%7Ctoken.resource1' +
        '&client-request-id=33333333-3333-4333-b333-333333333333' + auth._addLibMetadata() + '&prompt=none&login_hint=test%40testuser.com&domain_hint=testuser.com');
      done();
    }, 2000);
  });

    // Necessary for integration with Angular when multiple http calls are queued.
  it('allows multiple callers to be notified when the token is renewed. Also checks if all registered acquireToken callbacks are called in the case when one of the callbacks throws an error', (done) => {
    auth.config.redirectUri = 'contoso_site';
    auth.config.clientId = 'client';
    auth.config.expireOffsetSeconds = SECONDS_TO_EXPIRE + 100;
    let token = null;
    let token2 = null;
    const callback = (valErr, valToken) => {
      token = valToken;
      throw new Error("Error occurred in callback function");
    };
    const callback2 = (valErr, valToken) => {
      token2 = valToken;
    };

    auth._renewStates = [];
    auth._user = { profile: { upn: 'test@testuser.com' }, userName: 'test@domain.com' };
    auth.acquireToken(RESOURCE1, callback);
        // Simulate second acquire i.e. second service call from Angular.
    auth.acquireToken(RESOURCE1, callback2);
    expect(storageFake.getItem(auth.CONSTANTS.STORAGE.LOGIN_REQUEST)).toBe('');
    expect(auth._renewStates.length).toBe(1);
        // Wait for initial timeout load

    setTimeout(() => {
      expect(mockFrames['authRenewFrame' + RESOURCE1].src).toBe(conf.instance + 'authorize?response_type=token&client_id=client&resource=' + RESOURCE1 + '&redirect_uri=contoso_site&state=33333333-3333-4333-b333-333333333333%7Ctoken.resource1' +
        '&client-request-id=33333333-3333-4333-b333-333333333333' + auth._addLibMetadata() + '&prompt=none&login_hint=test%40testuser.com&domain_hint=testuser.com');
      done();
    }, 2000);

        // Simulate callback from the frame.
        // auth.callback(null, '33333333-3333-4333-b333-333333333333');
    window.callBackMappedToRenewStates[auth.config.state](null, '33333333-3333-4333-b333-333333333333');
        // Both callbacks should have been provided with the token.
    expect(token).toBe('33333333-3333-4333-b333-333333333333', 'First callback should be called');
    expect(token2).toBe('33333333-3333-4333-b333-333333333333', 'Second callback should be called');
  });

  it('check guid masking', () => {
    // masking is required for ver4 guid at begining hex  after version block
    // 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    Math.random = sinon.stub().returns(0.1);

    // 1->0001 after masked with & 0011 | 1000  1001
    expect(auth._guid()).toBe('11111111-1111-4111-9111-111111111111');
    Math.random = sinon.stub().returns(0.3);

    // 4->0100 after masked with & 0011 | 1000  1000
    expect(auth._guid()).toBe('44444444-4444-4444-8444-444444444444');
    Math.random = sinon.stub().returns(0.99);

    // 15->1111 after masked with & 0011 | 1000  1011
    expect(auth._guid()).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff');

    Math.random = sinon.stub().returns(0.9);

    // 14->1110 after masked with & 0011 | 1000  1010
    expect(auth._guid()).toBe('eeeeeeee-eeee-4eee-aeee-eeeeeeeeeeee');
    Math.random = sinon.stub().returns(0.2);

    // 3->0011 after masked with & 0011 | 1000  1011
    expect(auth._guid()).toBe('33333333-3333-4333-b333-333333333333');
  });

  it('prompts user if url is given', () => {
    storageFake.setItem(auth.CONSTANTS.STORAGE.USERNAME, 'test user');
    spyOn(window.location, 'replace');
    auth.promptUser();
    expect(window.location.replace).not.toHaveBeenCalled();
    auth.promptUser('test');
    expect(window.location.replace).toHaveBeenCalled();
  });

  it('clears cache', () => {
        // Keys are stored for each resource to map tokens for resource
    storageFake.setItem(auth.CONSTANTS.STORAGE.TOKEN_KEYS, 'key1|key2|' + RESOURCE1 + '|');
    storageFake.setItem(auth.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + 'key1', 'value1');
    storageFake.setItem(auth.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + 'key2', 'value2');
    storageFake.setItem(auth.CONSTANTS.STORAGE.EXPIRATION_KEY, 3);
    storageFake.setItem(auth.CONSTANTS.STORAGE.EXPIRATION_KEY, 3);
    storageFake.setItem(auth.CONSTANTS.STORAGE.SESSION_STATE, 'session_state');
    storageFake.setItem(auth.CONSTANTS.STORAGE.STATE_LOGIN, 'state login');
    storageFake.setItem(auth.CONSTANTS.STORAGE.USERNAME, 'username');
    storageFake.setItem(auth.CONSTANTS.STORAGE.ERROR, 'error');
    storageFake.setItem(auth.CONSTANTS.STORAGE.ERROR_DESCRIPTION, 'error description');
    auth.clearCache();
    const store = storageFake.storeVerify();
    for (const property in store) {
      if (store.hasOwnProperty(property)) {
        expect((store[property] === '' || store[property] === 0 || !store[property])).toBe(true);
      }
    }
  });

  it('clears cache for a resource', () => {
        // Keys are stored for each resource to map tokens for resource
    storageFake.setItem(auth.CONSTANTS.STORAGE.TOKEN_KEYS, 'key1|' + RESOURCE1 + '|');
    storageFake.setItem(auth.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + 'key1', 'value1');
    storageFake.setItem(auth.CONSTANTS.STORAGE.EXPIRATION_KEY + 'key1', 3);
    storageFake.setItem(auth.CONSTANTS.STORAGE.STATE_RENEW, 'state renew');
    storageFake.setItem(auth.CONSTANTS.STORAGE.ERROR, 'error');
    storageFake.setItem(auth.CONSTANTS.STORAGE.ERROR_DESCRIPTION, 'error description');
    auth.clearCacheForResource(RESOURCE1);
    const store = storageFake.storeVerify();
    for (const prop in store) {
      if (prop === auth.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + RESOURCE1 ||
               prop === auth.CONSTANTS.STORAGE.EXPIRATION_KEY + RESOURCE1) {
        expect((store[prop] === '' || store[prop] === 0 || !store[prop])).toBe(true);
      }
    }
    const item = auth.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + 'key1';
    expect((store[item] === '' || store[item] === 0 || !store[item])).toBe(false);
  });

  it('clears cache before logout', () => {
    auth.config.clientId = 'client';
    auth.config.redirectUri = 'contoso_site';
    spyOn(auth, 'clearCache');
    spyOn(auth, 'promptUser');
    auth.logOut();
    expect(auth.clearCache).toHaveBeenCalled();
    expect(auth.promptUser).toHaveBeenCalled();
  });

  it('has logout redirect if given', () => {
    storageFake.setItem(auth.CONSTANTS.STORAGE.USERNAME, 'test user');
    auth.config.displayCall = null;
    auth.config.clientId = 'client';
    auth.config.postLogoutRedirectUri = 'https://contoso.com/logout';
    spyOn(auth, 'promptUser');
    auth.logOut();
    expect(auth.promptUser).toHaveBeenCalledWith('https://login.microsoftonline.com/tenant/oauth2/logout?post_logout_redirect_uri=https%3A%2F%2Fcontoso.com%2Flogout');
  });

  it('gets user from cache', () => {
    storageFake.setItem(auth.CONSTANTS.STORAGE.IDTOKEN, IDTOKEN_MOCK);
    auth.config.clientId = 'e9a5a8b6-8af7-4719-9821-0deef255f68e';
    auth.config.loginResource = RESOURCE1;
    auth.config.expireOffsetSeconds = SECONDS_TO_EXPIRE - 100;
    let user = {};
    const callback = function(valErr, valResult) {
      user = valResult;
    };
    sinon.spy(auth, 'getCachedToken');
    auth.getUser(callback);
    expect(auth.getCachedToken.calledWith(RESOURCE1)).toEqual(false);
    expect(user.userName).toBe('user@oauthimplicit.ccsctp.net');
  });

  it('is callback if has error or access token or idtoken', () => {
    expect(auth.isCallback('not a callback')).toBe(false);
    expect(auth.isCallback('#error_description=someting_wrong')).toBe(true);
    expect(auth.isCallback('#/error_description=someting_wrong')).toBe(true);
    expect(auth.isCallback('#access_token=token123')).toBe(true);
    expect(auth.isCallback('#id_token=idtoken234')).toBe(true);
  });

  it('gets login error if any recorded', () => {
    storageFake.setItem(auth.CONSTANTS.STORAGE.LOGIN_ERROR, '');
    expect(auth.getLoginError()).toBe('');
    storageFake.setItem(auth.CONSTANTS.STORAGE.LOGIN_ERROR, 'err');
    expect(auth.getLoginError()).toBe('err');
  });

  const checkStateType = function(state, stateExpected, requestType) {
    storageFake.setItem(state, stateExpected);
    auth._renewStates.push(stateExpected);
    const requestInfo = auth.getRequestInfo('#error_description=someting_wrong&state=' + stateExpected);
    expect(requestInfo.valid).toBe(true);
    expect(requestInfo.stateResponse).toBe(stateExpected);
    expect(requestInfo.stateMatch).toBe(true);
    expect(requestInfo.requestType).toBe(requestType);
    storageFake.setItem(state, '');
  };

  it('gets request info from hash', () => {
    let requestInfo = auth.getRequestInfo('invalid');
    expect(requestInfo.valid).toBe(false);
    requestInfo = auth.getRequestInfo('#error_description=someting_wrong');
    expect(requestInfo.valid).toBe(true);
    expect(requestInfo.stateResponse).toBe('');

    requestInfo = auth.getRequestInfo('#error_description=someting_wrong&state=1232');
    expect(requestInfo.valid).toBe(true);
    expect(requestInfo.stateResponse).toBe('1232');
    expect(requestInfo.stateMatch).toBe(false);

    checkStateType(auth.CONSTANTS.STORAGE.STATE_LOGIN, '1234', auth.REQUEST_TYPE.LOGIN);
  });

  it('saves errors token from callback', () => {
    const requestInfo = {
      valid: false,
      parameters: { error_description: 'error description', error: 'invalid' },
      stateMatch: false,
      stateResponse: '',
      requestType: auth.REQUEST_TYPE.UNKNOWN
    };
    auth.saveTokenFromHash(requestInfo);

    expect(storageFake.getItem(auth.CONSTANTS.STORAGE.ERROR)).toBe('invalid');
    expect(storageFake.getItem(auth.CONSTANTS.STORAGE.ERROR_DESCRIPTION)).toBe('error description');
  });

  it('saves token if state matches', () => {
    const requestInfo = {
      valid: true,
      parameters: { access_token: 'token123', state: '123' },
      stateMatch: true,
      stateResponse: '123|loginResource1',
      requestType: auth.REQUEST_TYPE.RENEW_TOKEN
    };
    auth.saveTokenFromHash(requestInfo);

    expect(storageFake.getItem(auth.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + 'loginResource1')).toBe('token123');
  });

  it('saves expiry if state matches', () => {
    const requestInfo = {
      valid: true,
      parameters: { access_token: 'token123', state: '123', expires_in: 3589 },
      stateMatch: true,
      stateResponse: '123|loginResource1',
      requestType: auth.REQUEST_TYPE.RENEW_TOKEN
    };
    auth.saveTokenFromHash(requestInfo);
    expect(storageFake.getItem(auth.CONSTANTS.STORAGE.EXPIRATION_KEY + 'loginResource1')).toBe(Math.round(1) + 3589);
  });

  it('saves username after extracting idtoken', () => {
    const requestInfo = {
      valid: true,
      parameters: {
        id_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVUa0d0S1JrZ2FpZXpFWTJFc0xDMmdPTGpBNCJ9.eyJhdWQiOiJlOWE1YThiNi04YWY3LTQ3MTktOTgyMS0wZGVlZjI1NWY2OGUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLXBwZS5uZXQvNTJkNGIwNzItOTQ3MC00OWZiLTg3MjEtYmMzYTFjOTkxMmExLyIsImlhdCI6MTQxMTk2MDkwMiwibmJmIjoxNDExOTYwOTAyLCJleHAiOjE0MTE5NjQ4MDIsInZlciI6IjEuMCIsInRpZCI6IjUyZDRiMDcyLTk0NzAtNDlmYi04NzIxLWJjM2ExYzk5MTJhMSIsImFtciI6WyJwd2QiXSwib2lkIjoiZmEzYzVmYTctN2Q5OC00Zjk3LWJmYzQtZGJkM2E0YTAyNDMxIiwidXBuIjoidXNlckBvYXV0aGltcGxpY2l0LmNjc2N0cC5uZXQiLCJ1bmlxdWVfbmFtZSI6InVzZXJAb2F1dGhpbXBsaWNpdC5jY3NjdHAubmV0Iiwic3ViIjoiWTdUbXhFY09IUzI0NGFHa3RjbWpicnNrdk5tU1I4WHo5XzZmbVc2NXloZyIsImZhbWlseV9uYW1lIjoiYSIsImdpdmVuX25hbWUiOiJ1c2VyIiwibm9uY2UiOiIxOWU2N2IyNC1jZDk5LTQ1YjYtYTU4OC04NDBlM2Y4ZjJhNzAiLCJwd2RfZXhwIjoiNTc3ODAwOCIsInB3ZF91cmwiOiJodHRwczovL3BvcnRhbC5taWNyb3NvZnRvbmxpbmUuY29tL0NoYW5nZVBhc3N3b3JkLmFzcHgifQ.GzbTwMXhjs4uJFogd1B46C_gKX6uZ4BfgJIpzFS-n-HRXEWeKdZWboRC_-C4UnEy6G9kR6vNFq7zi3DY1P8uf1lUavdOFUE27xNY1McN1Vjm6HKxKNYOLU549-wIb6SSfGVycdyskdJfplf5VRasMGclwHlY0l9bBCTaPunjhfcg-mQmGKND-aO0B54EGhdGs740NiLMCh6kNXbp1WAv7V6Yn408qZEIsOQoPO0dW-wO54DTqpbLtqiwae0pk0hDxXWczaUPxR_wcz0f3TgF42iTp-j5bXTf2GOP1VPZtN9PtdjcjDIfZ6ihAVZCEDB_Y9czHv7et0IvB1bzRWP6bQ',
        state: '123'
      },
      stateMatch: true,
      stateResponse: '123',
      requestType: auth.REQUEST_TYPE.ID_TOKEN
    };
    storageFake.setItem(auth.CONSTANTS.STORAGE.NONCE_IDTOKEN, '19e67b24-cd99-45b6-a588-840e3f8f2a70');
    auth.config.clientId = conf.clientId;
    auth._user = null;
    auth.saveTokenFromHash(requestInfo);
    const cachedUser = auth.getCachedUser();
    expect(cachedUser.userName).toBe('user@oauthimplicit.ccsctp.net');
    expect(cachedUser.profile.upn).toBe('user@oauthimplicit.ccsctp.net');
  });

  it('does not save user for invalid nonce in idtoken', () => {
    const requestInfo = {
      valid: true,
      parameters: {
        id_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVUa0d0S1JrZ2FpZXpFWTJFc0xDMmdPTGpBNCJ9.eyJhdWQiOiJlOWE1YThiNi04YWY3LTQ3MTktOTgyMS0wZGVlZjI1NWY2OGUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLXBwZS5uZXQvNTJkNGIwNzItOTQ3MC00OWZiLTg3MjEtYmMzYTFjOTkxMmExLyIsImlhdCI6MTQxMTk2MDkwMiwibmJmIjoxNDExOTYwOTAyLCJleHAiOjE0MTE5NjQ4MDIsInZlciI6IjEuMCIsInRpZCI6IjUyZDRiMDcyLTk0NzAtNDlmYi04NzIxLWJjM2ExYzk5MTJhMSIsImFtciI6WyJwd2QiXSwib2lkIjoiZmEzYzVmYTctN2Q5OC00Zjk3LWJmYzQtZGJkM2E0YTAyNDMxIiwidXBuIjoidXNlckBvYXV0aGltcGxpY2l0LmNjc2N0cC5uZXQiLCJ1bmlxdWVfbmFtZSI6InVzZXJAb2F1dGhpbXBsaWNpdC5jY3NjdHAubmV0Iiwic3ViIjoiWTdUbXhFY09IUzI0NGFHa3RjbWpicnNrdk5tU1I4WHo5XzZmbVc2NXloZyIsImZhbWlseV9uYW1lIjoiYSIsImdpdmVuX25hbWUiOiJ1c2VyIiwibm9uY2UiOiIxOWU2N2IyNC1jZDk5LTQ1YjYtYTU4OC04NDBlM2Y4ZjJhNzAiLCJwd2RfZXhwIjoiNTc3ODAwOCIsInB3ZF91cmwiOiJodHRwczovL3BvcnRhbC5taWNyb3NvZnRvbmxpbmUuY29tL0NoYW5nZVBhc3N3b3JkLmFzcHgifQ.GzbTwMXhjs4uJFogd1B46C_gKX6uZ4BfgJIpzFS-n-HRXEWeKdZWboRC_-C4UnEy6G9kR6vNFq7zi3DY1P8uf1lUavdOFUE27xNY1McN1Vjm6HKxKNYOLU549-wIb6SSfGVycdyskdJfplf5VRasMGclwHlY0l9bBCTaPunjhfcg-mQmGKND-aO0B54EGhdGs740NiLMCh6kNXbp1WAv7V6Yn408qZEIsOQoPO0dW-wO54DTqpbLtqiwae0pk0hDxXWczaUPxR_wcz0f3TgF42iTp-j5bXTf2GOP1VPZtN9PtdjcjDIfZ6ihAVZCEDB_Y9czHv7et0IvB1bzRWP6bQ',
        state: '123'
      },
      stateMatch: true,
      stateResponse: '123',
      requestType: auth.REQUEST_TYPE.ID_TOKEN
    };
    auth.config.clientId = conf.clientId;
    auth._user = null;
    auth.saveTokenFromHash(requestInfo);
    expect(auth.getCachedUser()).toBe(null);
  });

  it('saves null for username if idtoken is invalid', () => {
    const requestInfo = {
      valid: true,
      parameters: {
        id_token: 'invalid',
        state: '123'
      },
      stateMatch: true,
      stateResponse: '123',
      requestType: auth.REQUEST_TYPE.ID_TOKEN
    };
    auth.config.loginResource = 'loginResource1';
    auth.saveTokenFromHash(requestInfo);

    expect(storageFake.getItem(auth.CONSTANTS.STORAGE.USERNAME)).toBeUndefined();
  });

  it('saves null for username if idtoken is invalid', () => {
    const requestInfo = {
      valid: true,
      parameters: {
        id_token: 'invalid',
        state: '123'
      },
      stateMatch: true,
      stateResponse: '123',
      requestType: auth.REQUEST_TYPE.ID_TOKEN
    };
    auth.config.loginResource = 'loginResource1';
    auth.saveTokenFromHash(requestInfo);

    expect(storageFake.getItem(auth.CONSTANTS.STORAGE.USERNAME)).toBeUndefined();
  });

  it('test decode with no padding', () => {
    expect(auth._decode('ZGVjb2RlIHRlc3Rz')).toBe('decode tests');
  });

  it('test decode with one = padding', () => {
    expect(auth._decode('ZWNvZGUgdGVzdHM=')).toBe('ecode tests');
  });

  it('test decode with two == padding', () => {
    expect(auth._decode('Y29kZSB0ZXN0cw==')).toBe('code tests');
  });

  it('test decode throw error', () => {
    try {
      auth._decode('YW55I');
    } catch (e) {
      expect(e.message).toBe('The token to be decoded is not correctly encoded.');
    }
  });

  it('test get resource for endpoint from app backend', () => {
    auth.config.redirectUri = 'https://host.com/page';
    expect(auth.getResourceForEndpoint('https://host.com')).toBe(auth.config.loginResource);
    expect(auth.getResourceForEndpoint('https://host.com/a/b')).toBe(auth.config.loginResource);
    expect(auth.getResourceForEndpoint('https://host.com/page/')).toBe(auth.config.loginResource);
    expect(auth.getResourceForEndpoint('https://notapp.com/page/')).toBe(null);
    expect(auth.getResourceForEndpoint('/api/todo')).toBe(auth.config.loginResource);
  });

  it('test host extraction', () => {
    expect(auth._getHostFromUri('https://a.com/b/c')).toBe('a.com');
    expect(auth._getHostFromUri('http://a.com')).toBe('a.com');
    expect(auth._getHostFromUri('a.com/b/c')).toBe('a.com');
    expect(auth._getHostFromUri('http://a.com/')).toBe('a.com');
    expect(auth._getHostFromUri('http://localhost:8080')).toBe('localhost:8080');
  });

  it('test decode jwt', () => {
    expect(auth._decodeJwt('')).toBe(null);
    expect(auth._decodeJwt(null)).toBe(null);
  });

  it('saves error if state mismatch', () => {
    const requestInfo = {
      valid: true,
      parameters: { access_token: 'token123', state: '123' },
      stateMatch: false,
      stateResponse: '64532',
      requestType: auth.REQUEST_TYPE.UNKNOWN
    };
    auth.config.loginResource = 'loginResource1';
    auth.saveTokenFromHash(requestInfo);

    expect(storageFake.getItem(auth.CONSTANTS.STORAGE.ERROR_DESCRIPTION)).toBe('Invalid_state. state: ' + requestInfo.stateResponse);
  });

  it('checks if Logging is defined on window', () => {
    Logging.level = 2;
    Logging.log = function(message) {
      global.window.logMessage = message;
    };
    auth.promptUser();
    expect(window.logMessage).toContain("Navigate url is empty");
    expect(Logging.level).toEqual(2);
  });

  it('tests the load frame timeout method', (done) => {
    auth._loadFrameTimeout('urlnavigation', 'frameName', RESOURCE1);
    expect(storageFake.getItem(auth.CONSTANTS.STORAGE.RENEW_STATUS + RESOURCE1)).toBe(auth.CONSTANTS.TOKEN_RENEW_STATUS_IN_PROGRESS);

    setTimeout(() => {
      expect(storageFake.getItem(auth.CONSTANTS.STORAGE.RENEW_STATUS + RESOURCE1)).toBe(auth.CONSTANTS.TOKEN_RENEW_STATUS_CANCELED);

      auth._loadFrameTimeout('urlnavigation', 'frameName', RESOURCE1);
      expect(storageFake.getItem(auth.CONSTANTS.STORAGE.RENEW_STATUS + RESOURCE1)).toBe(auth.CONSTANTS.TOKEN_RENEW_STATUS_IN_PROGRESS);
      const requestInfo = {
        valid: true,
        parameters: { access_token: 'token123', state: '123', expires_in: '23' },
        stateMatch: true,
        stateResponse: '64532|' + RESOURCE1,
        requestType: auth.REQUEST_TYPE.RENEW_TOKEN
      };
      auth.saveTokenFromHash(requestInfo);
      expect(storageFake.getItem(auth.CONSTANTS.STORAGE.RENEW_STATUS + RESOURCE1)).toBe(auth.CONSTANTS.TOKEN_RENEW_STATUS_COMPLETED);
      done();
    }, 1000);
  });

  it('tests that callbacks are called when renewal token request was canceled', (done) => {
    auth.config.expireOffsetSeconds = SECONDS_TO_EXPIRE + 100;
    let err = '';
    let token = '';
    const callback = function(valErr, valToken) {
      err = valErr;
      token = valToken;
    };
    auth._renewStates = [];
    auth._user = { userName: 'test@testuser.com' };
    auth.acquireToken(RESOURCE1, callback);
    setTimeout(() => {
      expect(storageFake.getItem(auth.CONSTANTS.STORAGE.RENEW_STATUS + RESOURCE1)).toBe(auth.CONSTANTS.TOKEN_RENEW_STATUS_CANCELED);
      expect(err).toBe('Token renewal operation failed due to timeout');
      expect(token).toBe(null);
      done();
    }, 1000);
  });

  it('attempts to renewidToken if token expired and renew is allowed', (done) => {
    auth.config.redirectUri = 'contoso_site';
    auth.config.clientId = 'client';
    auth.config.expireOffsetSeconds = SECONDS_TO_EXPIRE + 100;
    auth._renewStates = [];
    auth._user = { profile: { upn: 'test@testuser.com' }, userName: 'test@domain.com' };
    auth.acquireToken(auth.config.clientId, sinon.spy());
    expect(storageFake.getItem(auth.CONSTANTS.STORAGE.NONCE_IDTOKEN)).toBe('33333333-3333-4333-b333-333333333333');
    expect(auth.config.state).toBe('33333333-3333-4333-b333-333333333333|client');
    expect(auth._renewStates.length).toBe(1);
    expect(storageFake.getItem(auth.CONSTANTS.STORAGE.LOGIN_REQUEST)).toBe('');
        // Wait for initial timeout load

    setTimeout(() => {
      expect(mockFrames.authIdTokenFrame.src).toBe(conf.instance + 'authorize?response_type=id_token&client_id=' + auth.config.clientId + '&redirect_uri=contoso_site&state=33333333-3333-4333-b333-333333333333%7Cclient' +
        '&client-request-id=33333333-3333-4333-b333-333333333333' + auth._addLibMetadata() + '&prompt=none&login_hint=test%40testuser.com&domain_hint=testuser.com&nonce=33333333-3333-4333-b333-333333333333');
      done();
    }, 2000);
  });

  it('tests handleWindowCallback function for RENEW_TOKEN', () => {
    window.location.hash = '#/id_token=' + IDTOKEN_MOCK;
    const _getRequestInfo = auth.getRequestInfo;
    auth.getRequestInfo = function(hash) {
      return {
        valid: true,
        parameters: { error_description: 'error description', error: 'invalid', id_token: IDTOKEN_MOCK, session_state: '61ae5247-eaf8-4496-a667-32b0acbad7a0', state: '19537a2a-e9e7-489d-ae7d-3eefab9e4137' },
        stateMatch: true,
        stateResponse: '19537a2a-e9e7-489d-ae7d-3eefab9e4137',
        requestType: auth.REQUEST_TYPE.RENEW_TOKEN
      };
    };
    let err = '';
    let token = '';
    const callback = function(valErr, valToken) {
      err = valErr;
      token = valToken;
    };
    window.parent = {};
    window.parent.callBackMappedToRenewStates = {};
    window.parent.callBackMappedToRenewStates[auth.getRequestInfo().stateResponse] = callback;
    auth.handleWindowCallback();
    expect(err).toBe('error description');
    expect(token).toBe(IDTOKEN_MOCK);
    auth.getRequestInfo = _getRequestInfo;
  });

  it('tests handleWindowCallback function for LOGIN_REQUEST', () => {
    window.location = {};
    window.location.hash = '#/id_token=' + IDTOKEN_MOCK;
    const _getRequestInfo = auth.getRequestInfo;
    auth.getRequestInfo = function() {
      return {
        valid: true,
        parameters: { error_description: 'error description', error: 'invalid', id_token: IDTOKEN_MOCK, session_state: '61ae5247-eaf8-4496-a667-32b0acbad7a0', state: '19537a2a-e9e7-489d-ae7d-3eefab9e4137' },
        stateMatch: true,
        stateResponse: '19537a2a-e9e7-489d-ae7d-3eefab9e4137',
        requestType: auth.REQUEST_TYPE.LOGIN_REQUEST
      };
    };
    storageFake.setItem(auth.CONSTANTS.STORAGE.LOGIN_REQUEST, "www.test.com");
    window.oauth2Callback = {};
    auth.handleWindowCallback();
    expect(window.location).toBe('www.test.com');
    auth.getRequestInfo = _getRequestInfo;
  });

  it('use the same correlationId for each request sent to AAD if set by user', () => {
    auth.config.correlationId = '33333333-3333-4333-b333-333333333333';
    auth.config.redirectUri = 'contoso_site';
    auth.config.clientId = 'client';
    auth.config.expireOffsetSeconds = SECONDS_TO_EXPIRE + 100;
    const callback = function() {
    };
    auth._renewStates = [];
    auth._user = { profile: { upn: 'test@testuser.com' }, userName: 'test@domain.com' };
    spyOn(auth, '_loadFrameTimeout');
    auth.acquireToken(RESOURCE1, callback);
    expect(auth._loadFrameTimeout).toHaveBeenCalledWith(conf.instance + 'authorize?response_type=token&client_id=client&resource=' + RESOURCE1 + '&redirect_uri=contoso_site&state=33333333-3333-4333-b333-333333333333%7Ctoken.resource1' +
      '&client-request-id=33333333-3333-4333-b333-333333333333' + auth._addLibMetadata() + '&prompt=none&login_hint=test%40testuser.com&domain_hint=testuser.com', 'authRenewFrametoken.resource1', 'token.resource1');

    auth._activeRenewals = {};
    auth._user = { profile: { sub: 'test@testuser.com' }, userName: 'test@domain.com' };
    auth.acquireToken(RESOURCE1, callback);
    expect(auth._loadFrameTimeout).toHaveBeenCalledWith(conf.instance + 'authorize?response_type=token&client_id=client&resource=' + RESOURCE1 + '&redirect_uri=contoso_site&state=33333333-3333-4333-b333-333333333333%7Ctoken.resource1' +
      '&client-request-id=33333333-3333-4333-b333-333333333333' + auth._addLibMetadata() + '&prompt=none', 'authRenewFrametoken.resource1', 'token.resource1');
  });

  it('generates new correlationId for each request sent to AAD if not set by user', () => {
    auth.config.correlationId = null;
    auth.config.redirectUri = 'contoso_site';
    auth.config.clientId = 'client';
    auth.config.expireOffsetSeconds = SECONDS_TO_EXPIRE + 100;
    const callback = sinon.spy();
    auth._renewStates = [];
    auth._user = { profile: { upn: 'test@testuser.com' }, userName: 'test@domain.com' };
    Math.random = sinon.stub().returns(0.1);
    spyOn(auth, '_loadFrameTimeout');
    auth.acquireToken(RESOURCE1, callback);
    expect(auth._loadFrameTimeout).toHaveBeenCalledWith(conf.instance + 'authorize?response_type=token&client_id=client&resource=' + RESOURCE1 + '&redirect_uri=contoso_site&state=11111111-1111-4111-9111-111111111111%7Ctoken.resource1' +
      '&client-request-id=11111111-1111-4111-9111-111111111111' + auth._addLibMetadata() + '&prompt=none&login_hint=test%40testuser.com&domain_hint=testuser.com', 'authRenewFrametoken.resource1', 'token.resource1');

    Math.random = sinon.stub().returns(0.3);
    auth._activeRenewals = {};
    auth._user = { profile: { sub: 'test@testuser.com' }, userName: 'test@domain.com' };
    auth.acquireToken(RESOURCE1, callback);
    expect(auth._loadFrameTimeout).toHaveBeenCalledWith(conf.instance + 'authorize?response_type=token&client_id=client&resource=' + RESOURCE1 + '&redirect_uri=contoso_site&state=44444444-4444-4444-8444-444444444444%7Ctoken.resource1' +
      '&client-request-id=44444444-4444-4444-8444-444444444444' + auth._addLibMetadata() + '&prompt=none', 'authRenewFrametoken.resource1', 'token.resource1');
  });

  it('checks the deserialize method for extracting idToken', () => {
    let obj = auth._deserialize(VALID_URLFRAGMENT);
    expect(obj.id_token).toBe(IDTOKEN_MOCK);
    expect(obj.state).toBe(STATE);
    expect(obj.session_state).toBe(SESSION_STATE);

    obj = auth._deserialize(INVALID_URLFRAGMENT);
    expect(obj.id_token).toBeUndefined();
    expect(obj.state).toBe(STATE);
    expect(obj.session_state).toBe(SESSION_STATE);
    expect(obj['id_token' + IDTOKEN_MOCK]).toBeUndefined();
    const deserialize = auth._deserialize;// save initial state of function

    auth._deserialize = (query) => {
      const pl = /\+/g; // Regex for replacing addition symbol with a space
      const search = /([^&=]+)=?([^&]*)/g;
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
    };
    obj = auth._deserialize(INVALID_URLFRAGMENT);
    expect(obj['id_token' + IDTOKEN_MOCK]).toBe('');// This additional property is parsed because of ? operator in regex
    expect(obj.id_token).toBeUndefined();
    expect(obj.state).toBe(STATE);
    expect(obj.session_state).toBe(SESSION_STATE);
    auth._deserialize = deserialize;// reassign state to original function
  });

  it('tests if callback is called after login, if popup window is null', () => {
    auth.popUp = true;
    auth.config.clientId = 'client';
    auth.config.redirectUri = 'contoso_site';
    let err;
    let token;
    const callback = (valErr, valToken) => {
      err = valErr;
      token = valToken;
    };
    window.open = () => {
      return null;
    };
    auth.callback = callback;
    auth.login();
    expect(err).toBe('Popup Window is null. This can happen if you are using IE');
    expect(token).toBe(null);
    expect(auth.loginInProgress()).toBe(false);
  });

  it('tests login functionality in case of popup window', (done) => {
    let timercallback;
    window.location = { search: undefined };
    window.clearInterval = sinon.spy();
    window.setInterval = (method, timer) => {
      timercallback = method;
    };
    auth.popUp = true;
    auth.config.clientId = 'client';
    auth.config.redirectUri = 'contoso_site';
    let popupWindow;
    window.open = () => {
      popupWindow = {
        location: {
          hash: VALID_URLFRAGMENT,
          href: 'hrefcontoso_site',
          search: undefined
        },
        closed: false,
        close: () => {
          this.closed = true;
        }
      };
      return popupWindow;
    };
    let token;
    const callback = (valErr, valToken) => {
      token = valToken;
    };
    auth.callback = callback;
    Math.random = sinon.stub().returns(0.2);

    auth.login();
    setTimeout(() => {
      timercallback();
      storageFake.setItem(auth.CONSTANTS.STORAGE.LOGIN_REQUEST, 'home page');
      expect(auth.loginInProgress()).toBe(false);
      expect(token).toBe(IDTOKEN_MOCK);
      expect(window.location.href).not.toBe('home page');
      done();
    }, 2000);
  });

  it('ensures that auth.callback is not overridden in calls to getUser', () => {
    const _callback = auth.callback;
    auth.callback = null;
    let user = {};
    const callback = (valErr, valResult) => {
      user = valResult;
    };
    auth._user = { profile: { upn: 'test@testuser.com' }, userName: 'test@domain.com' };
    auth.getUser(callback);
    expect(user).toBe(auth._user);
    expect(auth.callback).toBe(null);
    auth.callback = _callback;
  });

  it('tests _guid function if window.crypto is defined in the browser', () => {
    const buffer = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    window.msCrypto = null;
    window.crypto = {
      getRandomValues: (_buffer) => {
        for (let i = 0; i < _buffer.length; i++) {
          _buffer[i] = buffer[i];
        }
      }
    };
    expect(auth._guid()).toBe('00010203-0405-4607-8809-0a0b0c0d0e0f');
    window.crypto = null;
  });

  it('verifies _getNavigateUrl() returns the correct value when scope and responseType are not truthy', () => {
    auth.config.instance = 'https://login.microsoftonline.com/contoso/oauth2/';
    auth.config.scope = '';
    auth.setResponseType('');
    auth.config.clientId = 'the_client_id';
    auth.config.redirectUri = 'the_redirect_uri';
    auth.config.state = 'the_state';
    auth.config.correlationId = 'the_correlation_id';
    expect(auth._getNavigateUrl(auth.config.responseType, '')).toMatch(/https:\/\/login\.microsoftonline\.com\/contoso\/oauth2\/authorize\?response_type=id_token&client_id=the_client_id&redirect_uri=the_redirect_uri&state=the_state&client-request-id=the_correlation_id.*/);
  });

  it('verifies _getNavigateUrl() returns the correct value when scope is not truthy and responseType is truthy', () => {
    auth.config.instance = 'https://login.microsoftonline.com/contoso/oauth2/';
    auth.config.scope = '';
    auth.setResponseType('id_token token');
    auth.config.clientId = 'the_client_id';
    auth.config.redirectUri = 'the_redirect_uri';
    auth.config.state = 'the_state';
    auth.config.correlationId = 'the_correlation_id';
    expect(auth._getNavigateUrl(auth.config.responseType, '')).toMatch(/https:\/\/login\.microsoftonline\.com\/contoso\/oauth2\/authorize\?response_type=id_token%20token&client_id=the_client_id&redirect_uri=the_redirect_uri&state=the_state&client-request-id=the_correlation_id.*/);
  });

  it('verifies _getNavigateUrl() returns the correct value when scope is truthy and responseType is not truthy', () => {
    auth.config.instance = 'https://login.microsoftonline.com/contoso/oauth2/';
    auth.config.scope = 'openid';
    auth.setResponseType('');
    auth.config.clientId = 'the_client_id';
    auth.config.redirectUri = 'the_redirect_uri';
    auth.config.state = 'the_state';
    auth.config.correlationId = 'the_correlation_id';
    expect(auth._getNavigateUrl(auth.config.responseType, '')).toMatch(/https:\/\/login\.microsoftonline\.com\/contoso\/oauth2\/authorize\?response_type=id_token&client_id=the_client_id&redirect_uri=the_redirect_uri&state=the_state&client-request-id=the_correlation_id.*&scope=openid/);
  });

  it('verifies _getNavigateUrl() returns the correct value when scope and responseType are truthy', () => {
    auth.config.instance = 'https://login.microsoftonline.com/contoso/oauth2/';
    auth.config.scope = 'openid';
    auth.setResponseType('id_token token');
    auth.config.clientId = 'the_client_id';
    auth.config.redirectUri = 'the_redirect_uri';
    auth.config.state = 'the_state';
    auth.config.correlationId = 'the_correlation_id';
    expect(auth._getNavigateUrl(auth.config.responseType, '')).toMatch(/https:\/\/login\.microsoftonline\.com\/contoso\/oauth2\/authorize\?response_type=id_token%20token&client_id=the_client_id&redirect_uri=the_redirect_uri&state=the_state&client-request-id=the_correlation_id.*&scope=openid/);
  });

  it('verifies _createUser() returns null when an aud claim is not contained within the id_token', () => {
    const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVUa0d0S1JrZ2FpZXpFWTJFc0xDMmdPTGpBNCJ9.eyJhdWQiOiJlOWE1YThiNi04YWY3LTQ3MTktOTgyMS0wZGVlZjI1NWY2OGUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLXBwZS5uZXQvNTJkNGIwNzItOTQ3MC00OWZiLTg3MjEtYmMzYTFjOTkxMmExLyIsImlhdCI6MTQxMTk1OTAwMCwibmJmIjoxNDExOTU5MDAwLCJleHAiOjE0MTE5NjI5MDAsInZlciI6IjEuMCIsInRpZCI6IjUyZDRiMDcyLTk0NzAtNDlmYi04NzIxLWJjM2ExYzk5MTJhMSIsImFtciI6WyJwd2QiXSwib2lkIjoiZmEzYzVmYTctN2Q5OC00Zjk3LWJmYzQtZGJkM2E0YTAyNDMxIiwidXBuIjoidXNlckBvYXV0aGltcGxpY2l0LmNjc2N0cC5uZXQiLCJ1bmlxdWVfbmFtZSI6InVzZXJAb2F1dGhpbXBsaWNpdC5jY3NjdHAubmV0Iiwic3ViIjoiWTdUbXhFY09IUzI0NGFHa3RjbWpicnNrdk5tU1I4WHo5XzZmbVc2NXloZyIsImZhbWlseV9uYW1lIjoiYSIsImdpdmVuX25hbWUiOiJ1c2VyIiwibm9uY2UiOiI4MGZmYTkwYS1jYjc0LTRkMGYtYTRhYy1hZTFmOTNlMzJmZTAiLCJwd2RfZXhwIjoiNTc3OTkxMCIsInB3ZF91cmwiOiJodHRwczovL3BvcnRhbC5taWNyb3NvZnRvbmxpbmUuY29tL0NoYW5nZVBhc3N3b3JkLmFzcHgifQ.eyJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLXBwZS5uZXQvNTJkNGIwNzItOTQ3MC00OWZiLTg3MjEtYmMzYTFjOTkxMmExLyIsImlhdCI6MTQxMTk1OTAwMCwibmJmIjoxNDExOTU5MDAwLCJleHAiOjE0MTE5NjI5MDAsInZlciI6IjEuMCIsInRpZCI6IjUyZDRiMDcyLTk0NzAtNDlmYi04NzIxLWJjM2ExYzk5MTJhMSIsImFtciI6WyJwd2QiXSwib2lkIjoiZmEzYzVmYTctN2Q5OC00Zjk3LWJmYzQtZGJkM2E0YTAyNDMxIiwidXBuIjoidXNlckBvYXV0aGltcGxpY2l0LmNjc2N0cC5uZXQiLCJ1bmlxdWVfbmFtZSI6InVzZXJAb2F1dGhpbXBsaWNpdC5jY3NjdHAubmV0Iiwic3ViIjoiWTdUbXhFY09IUzI0NGFHa3RjbWpicnNrdk5tU1I4WHo5XzZmbVc2NXloZyIsImZhbWlseV9uYW1lIjoiYSIsImdpdmVuX25hbWUiOiJ1c2VyIiwibm9uY2UiOiI4MGZmYTkwYS1jYjc0LTRkMGYtYTRhYy1hZTFmOTNlMzJmZTAiLCJwd2RfZXhwIjoiNTc3OTkxMCIsInB3ZF91cmwiOiJodHRwczovL3BvcnRhbC5taWNyb3NvZnRvbmxpbmUuY29tL0NoYW5nZVBhc3N3b3JkLmFzcHgifQ==";
    expect(auth._createUser(TOKEN)).toBe(null);
  });

  it('verifies _createUser() returns user object with userName matching the upn contained within the id_token when a single aud claim matching the clientId is present', () => {
    auth.config.clientId = 'e9a5a8b6-8af7-4719-9821-0deef255f68e';
    expect(auth._createUser(IDTOKEN_MOCK).userName).toBe('user@oauthimplicit.ccsctp.net');
  });

  it('verifies _createUser() returns null when an unmatching single aud claim is contained within the id_token', () => {
    auth.config.clientId = 'not-a-match';
    expect(auth._createUser(IDTOKEN_MOCK)).toBe(null);
  });

  it('verifies _createUser returns user object with userName matching the upn contained within the id_token when an aud claim array is present and a matching azp claim is present', () => {
    auth.config.clientId = 'e9a5a8b6-8af7-4719-9821-0deef255f68e';
    const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVUa0d0S1JrZ2FpZXpFWTJFc0xDMmdPTGpBNCJ9.eyJhdWQiOlsiZTlhNWE4YjYtOGFmNy00NzE5LTk4MjEtMGRlZWYyNTVmNjhlIl0sImF6cCI6ImU5YTVhOGI2LThhZjctNDcxOS05ODIxLTBkZWVmMjU1ZjY4ZSIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MtcHBlLm5ldC81MmQ0YjA3Mi05NDcwLTQ5ZmItODcyMS1iYzNhMWM5OTEyYTEvIiwiaWF0IjoxNDExOTU5MDAwLCJuYmYiOjE0MTE5NTkwMDAsImV4cCI6MTQxMTk2MjkwMCwidmVyIjoiMS4wIiwidGlkIjoiNTJkNGIwNzItOTQ3MC00OWZiLTg3MjEtYmMzYTFjOTkxMmExIiwiYW1yIjpbInB3ZCJdLCJvaWQiOiJmYTNjNWZhNy03ZDk4LTRmOTctYmZjNC1kYmQzYTRhMDI0MzEiLCJ1cG4iOiJ1c2VyQG9hdXRoaW1wbGljaXQuY2NzY3RwLm5ldCIsInVuaXF1ZV9uYW1lIjoidXNlckBvYXV0aGltcGxpY2l0LmNjc2N0cC5uZXQiLCJzdWIiOiJZN1RteEVjT0hTMjQ0YUdrdGNtamJyc2t2Tm1TUjhYejlfNmZtVzY1eWhnIiwiZmFtaWx5X25hbWUiOiJhIiwiZ2l2ZW5fbmFtZSI6InVzZXIiLCJub25jZSI6IjgwZmZhOTBhLWNiNzQtNGQwZi1hNGFjLWFlMWY5M2UzMmZlMCIsInB3ZF9leHAiOiI1Nzc5OTEwIiwicHdkX3VybCI6Imh0dHBzOi8vcG9ydGFsLm1pY3Jvc29mdG9ubGluZS5jb20vQ2hhbmdlUGFzc3dvcmQuYXNweCJ9.WHsl8TH1rQ3dQbRkV0TS6GBVAxzNOpG3nGG6mpEBCwAOCbyW6qRsSoo4qq8I5IGyerDf2cvcS-zzatHEROpRC9dcpwkRm6ta5dFZuouFyZ_QiYVKSMwfzEC_FI-6p7eT8gY6FbV51bp-Ah_WKJqEmaXv-lqjIpgsMGeWDgZRlB9cPODXosBq-PEk0q27Be-_A-KefQacJuWTX2eEhECLyuAu-ETVJb7s19jQrs_LJXz_ISib4DdTKPa7XTBDJlVGdCI18ctB67XwGmGi8MevkeKqFI8dkykTxeJ0MXMmEQbE6Fw-gxmP7uJYbZ61Jqwsw24zMDMeXatk2VWMBPCuhA';
    expect(auth._createUser(TOKEN).userName).toBe('user@oauthimplicit.ccsctp.net');
  });

  it('verifies _createUser returns null when the id_token contains an matching aud claim within an aud claim array but without a matching azp claim', () => {
    auth.config.clientId = 'e9a5a8b6-8af7-4719-9821-0deef255f68e';
    const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVUa0d0S1JrZ2FpZXpFWTJFc0xDMmdPTGpBNCJ9.eyJhdWQiOlsiZTlhNWE4YjYtOGFmNy00NzE5LTk4MjEtMGRlZWYyNTVmNjhlIl0sImF6cCI6Im5vdC1hLW1hdGNoIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy1wcGUubmV0LzUyZDRiMDcyLTk0NzAtNDlmYi04NzIxLWJjM2ExYzk5MTJhMS8iLCJpYXQiOjE0MTE5NTkwMDAsIm5iZiI6MTQxMTk1OTAwMCwiZXhwIjoxNDExOTYyOTAwLCJ2ZXIiOiIxLjAiLCJ0aWQiOiI1MmQ0YjA3Mi05NDcwLTQ5ZmItODcyMS1iYzNhMWM5OTEyYTEiLCJhbXIiOlsicHdkIl0sIm9pZCI6ImZhM2M1ZmE3LTdkOTgtNGY5Ny1iZmM0LWRiZDNhNGEwMjQzMSIsInVwbiI6InVzZXJAb2F1dGhpbXBsaWNpdC5jY3NjdHAubmV0IiwidW5pcXVlX25hbWUiOiJ1c2VyQG9hdXRoaW1wbGljaXQuY2NzY3RwLm5ldCIsInN1YiI6Ilk3VG14RWNPSFMyNDRhR2t0Y21qYnJza3ZObVNSOFh6OV82Zm1XNjV5aGciLCJmYW1pbHlfbmFtZSI6ImEiLCJnaXZlbl9uYW1lIjoidXNlciIsIm5vbmNlIjoiODBmZmE5MGEtY2I3NC00ZDBmLWE0YWMtYWUxZjkzZTMyZmUwIiwicHdkX2V4cCI6IjU3Nzk5MTAiLCJwd2RfdXJsIjoiaHR0cHM6Ly9wb3J0YWwubWljcm9zb2Z0b25saW5lLmNvbS9DaGFuZ2VQYXNzd29yZC5hc3B4In0=.WHsl8TH1rQ3dQbRkV0TS6GBVAxzNOpG3nGG6mpEBCwAOCbyW6qRsSoo4qq8I5IGyerDf2cvcS-zzatHEROpRC9dcpwkRm6ta5dFZuouFyZ_QiYVKSMwfzEC_FI-6p7eT8gY6FbV51bp-Ah_WKJqEmaXv-lqjIpgsMGeWDgZRlB9cPODXosBq-PEk0q27Be-_A-KefQacJuWTX2eEhECLyuAu-ETVJb7s19jQrs_LJXz_ISib4DdTKPa7XTBDJlVGdCI18ctB67XwGmGi8MevkeKqFI8dkykTxeJ0MXMmEQbE6Fw-gxmP7uJYbZ61Jqwsw24zMDMeXatk2VWMBPCuhA';
    expect(auth._createUser(TOKEN)).toBe(null);
  });

  it('verifies _createUser returns user object with userName matching the email claim contained within the id_token when no upn claim is present and a single aud claim matchint the clientId is present', () => {
    auth.config.clientId = 'e9a5a8b6-8af7-4719-9821-0deef255f68e';
    const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVUa0d0S1JrZ2FpZXpFWTJFc0xDMmdPTGpBNCJ9.eyJhdWQiOiJlOWE1YThiNi04YWY3LTQ3MTktOTgyMS0wZGVlZjI1NWY2OGUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLXBwZS5uZXQvNTJkNGIwNzItOTQ3MC00OWZiLTg3MjEtYmMzYTFjOTkxMmExLyIsImlhdCI6MTQxMTk1OTAwMCwibmJmIjoxNDExOTU5MDAwLCJleHAiOjE0MTE5NjI5MDAsInZlciI6IjEuMCIsInRpZCI6IjUyZDRiMDcyLTk0NzAtNDlmYi04NzIxLWJjM2ExYzk5MTJhMSIsImFtciI6WyJwd2QiXSwib2lkIjoiZmEzYzVmYTctN2Q5OC00Zjk3LWJmYzQtZGJkM2E0YTAyNDMxIiwiZW1haWwiOiJ1c2VyQG9hdXRoaW1wbGljaXQuY2NzY3RwLm5ldCIsInVuaXF1ZV9uYW1lIjoidXNlckBvYXV0aGltcGxpY2l0LmNjc2N0cC5uZXQiLCJzdWIiOiJZN1RteEVjT0hTMjQ0YUdrdGNtamJyc2t2Tm1TUjhYejlfNmZtVzY1eWhnIiwiZmFtaWx5X25hbWUiOiJhIiwiZ2l2ZW5fbmFtZSI6InVzZXIiLCJub25jZSI6IjgwZmZhOTBhLWNiNzQtNGQwZi1hNGFjLWFlMWY5M2UzMmZlMCIsInB3ZF9leHAiOiI1Nzc5OTEwIiwicHdkX3VybCI6Imh0dHBzOi8vcG9ydGFsLm1pY3Jvc29mdG9ubGluZS5jb20vQ2hhbmdlUGFzc3dvcmQuYXNweCJ9.WHsl8TH1rQ3dQbRkV0TS6GBVAxzNOpG3nGG6mpEBCwAOCbyW6qRsSoo4qq8I5IGyerDf2cvcS-zzatHEROpRC9dcpwkRm6ta5dFZuouFyZ_QiYVKSMwfzEC_FI-6p7eT8gY6FbV51bp-Ah_WKJqEmaXv-lqjIpgsMGeWDgZRlB9cPODXosBq-PEk0q27Be-_A-KefQacJuWTX2eEhECLyuAu-ETVJb7s19jQrs_LJXz_ISib4DdTKPa7XTBDJlVGdCI18ctB67XwGmGi8MevkeKqFI8dkykTxeJ0MXMmEQbE6Fw-gxmP7uJYbZ61Jqwsw24zMDMeXatk2VWMBPCuhA';
    expect(auth._createUser(TOKEN).userName).toBe('user@oauthimplicit.ccsctp.net');
  });

  it('verifies _createUser returns user object with userName matching the sub claim contained within the id_token when no upn and no email claim are present and a single aud claim matchint the clientId is present', () => {
    auth.config.clientId = 'e9a5a8b6-8af7-4719-9821-0deef255f68e';
    const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVUa0d0S1JrZ2FpZXpFWTJFc0xDMmdPTGpBNCJ9.eyJhdWQiOiJlOWE1YThiNi04YWY3LTQ3MTktOTgyMS0wZGVlZjI1NWY2OGUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLXBwZS5uZXQvNTJkNGIwNzItOTQ3MC00OWZiLTg3MjEtYmMzYTFjOTkxMmExLyIsImlhdCI6MTQxMTk1OTAwMCwibmJmIjoxNDExOTU5MDAwLCJleHAiOjE0MTE5NjI5MDAsInZlciI6IjEuMCIsInRpZCI6IjUyZDRiMDcyLTk0NzAtNDlmYi04NzIxLWJjM2ExYzk5MTJhMSIsImFtciI6WyJwd2QiXSwib2lkIjoiZmEzYzVmYTctN2Q5OC00Zjk3LWJmYzQtZGJkM2E0YTAyNDMxIiwidW5pcXVlX25hbWUiOiJ1c2VyQG9hdXRoaW1wbGljaXQuY2NzY3RwLm5ldCIsInN1YiI6Ilk3VG14RWNPSFMyNDRhR2t0Y21qYnJza3ZObVNSOFh6OV82Zm1XNjV5aGciLCJmYW1pbHlfbmFtZSI6ImEiLCJnaXZlbl9uYW1lIjoidXNlciIsIm5vbmNlIjoiODBmZmE5MGEtY2I3NC00ZDBmLWE0YWMtYWUxZjkzZTMyZmUwIiwicHdkX2V4cCI6IjU3Nzk5MTAiLCJwd2RfdXJsIjoiaHR0cHM6Ly9wb3J0YWwubWljcm9zb2Z0b25saW5lLmNvbS9DaGFuZ2VQYXNzd29yZC5hc3B4In0=.WHsl8TH1rQ3dQbRkV0TS6GBVAxzNOpG3nGG6mpEBCwAOCbyW6qRsSoo4qq8I5IGyerDf2cvcS-zzatHEROpRC9dcpwkRm6ta5dFZuouFyZ_QiYVKSMwfzEC_FI-6p7eT8gY6FbV51bp-Ah_WKJqEmaXv-lqjIpgsMGeWDgZRlB9cPODXosBq-PEk0q27Be-_A-KefQacJuWTX2eEhECLyuAu-ETVJb7s19jQrs_LJXz_ISib4DdTKPa7XTBDJlVGdCI18ctB67XwGmGi8MevkeKqFI8dkykTxeJ0MXMmEQbE6Fw-gxmP7uJYbZ61Jqwsw24zMDMeXatk2VWMBPCuhA';
    expect(auth._createUser(TOKEN).userName).toBe('Y7TmxEcOHS244aGktcmjbrskvNmSR8Xz9_6fmW65yhg');
  });

  it('verifies that isCallback returns false if both the fragment and search portions of the URL are blank', () => {
    expect(auth.isCallback(undefined, undefined)).toBe(false);
  });

  it('verifies that isCallback returns true if the fragment portion of the URL contains an id_token and the search portion is blank', () => {
    const hash = '#/' + VALID_URLFRAGMENT;
    expect(auth.isCallback(hash, undefined)).toBe(true);
  });

  it('verifies that isCallback returns true if the fragment portion of the URL is blank and the search portion contains an id_token', () => {
    const search = '?id_token=eyJ4NXQiOiJObUptT0dVeE16WmxZak0yWkRSaE5UWmxZVEExWXpkaFpUUmlPV0UwTldJMk0ySm1PVGMxWkEiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImF1ZCI6WyJoUDdwa3JXYUJQa2NPTERaVmJsel9JZ2VtVmthIl0sImF6cCI6ImhQN3BrcldhQlBrY09MRFpWYmx6X0lnZW1Wa2EiLCJhdXRoX3RpbWUiOjE0NzU1MjI4MDksImlzcyI6Imh0dHBzOlwvXC9sb2NhbGhvc3Q6OTQ0M1wvb2F1dGgyXC90b2tlbiIsInNuIjoiV29vZHdhcmQiLCJnaXZlbl9uYW1lIjoiRGF2aWQiLCJleHAiOjE0NzU1MjMxMDksIm5vbmNlIjoiNWE3MWM5ZmYtYjI1YS00YzE1LWEzNjgtNzdmODgwZWRkOWI2IiwiaWF0IjoxNDc1NTIyODA5fQ.B5KAglX92PPppP66yMkyzD1LA7qdWhrQWqYEOzJ0uFB_ZN8_u7G7Pp0qBy0Uilbh6AS0go64pzX5sxU72psHr6z2xVMJYm8-zjTb1GDVP3thUlZ1nEK-esUjSBLDnN1qKmMINtX82S3KIpAlehB1nZ94kbOHCoZ9v_k1rnTiWRA&state=6777d1e8-6014-403d-ac0c-297dec5cc514';
    expect(auth.isCallback(undefined, search)).toBe(true);
  });

  it('verifies that isCallback returns true if the fragment portion of the URL contains a access_token and the search portion is blank', () => {
    const hash = '#/access_token=4dce1d4c-3828-3873-bdda-9b2ba2726ac4&state=1120063b-8c7b-4fac-a121-a0e7e4ccb270&token_type=Bearer&expires_in=197&session_state=a41ac575b3d4c1b50acee40499a7efc1d46485913bd8520b13eebec6a657da3e.Vxrih14RiYpyTIs-X21-Pg';
    expect(auth.isCallback(hash, undefined)).toBe(true);
  });

  it('verifies that isCallback returns true if the fragment portion of the URL contains both a access_token and an id_token (after embedded question mark) and the search portion is blank', () => {
    const hash = '#/access_token=eda1a60f-4dbd-3b8c-bfce-60d3980040a5&id_token=eyJ4NXQiOiJObUptT0dVeE16WmxZak0yWkRSaE5UWmxZVEExWXpkaFpUUmlPV0UwTldJMk0ySm1PVGMxWkEiLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiQUI4Si1WaHlvbWxseTJBbktvN2dVUSIsInN1YiI6ImFkbWluIiwiYXVkIjpbImhQN3BrcldhQlBrY09MRFpWYmx6X0lnZW1Wa2EiXSwiYXpwIjoiaFA3cGtyV2FCUGtjT0xEWlZibHpfSWdlbVZrYSIsImF1dGhfdGltZSI6MTQ3NTUyMjUyMCwiaXNzIjoiaHR0cHM6XC9cL2xvY2FsaG9zdDo5NDQzXC9vYXV0aDJcL3Rva2VuIiwic24iOiJXb29kd2FyZCIsImdpdmVuX25hbWUiOiJEYXZpZCIsImV4cCI6MTQ3NTUyMjgyMCwibm9uY2UiOiI1NTRkMjE5Ny0yYTQzLTQzMGUtOGJmNy1kMjk5MTIxNjE5MDEiLCJpYXQiOjE0NzU1MjI1MjB9.WrTgmLsBuP6BG1v1aBs4dp3ONYEtuzlUySsG4ImpAVIBg9BJv_nc9NPDSK_IMxiKi7sHwJWzCzNLHUbOkmmZxTqIQt7KEs_Kx2ZBlf_Yvb_YPyAcUasBlX4BzHLq0nOAqax43fgholLLXPA4WZmBkDVw6piquPQ45uCJ8_Myezs&state=e60a53f8-fadc-477a-b51d-64e7c31b06e9&token_type=Bearer&expires_in=300&session_state=8cbc061a22547adff4c5f88a80de8999129997b8ff7c7c66c870a43d6d2a2d6a.enxHcp7nDHTPhFPWaY-l4g';
    expect(auth.isCallback(hash, undefined)).toBe(true);
  });

  it('verifies that _getParameters returns an empty object if both the fragment and search portions of the URL are blank', () => {
    expect(Object.getOwnPropertyNames(auth._getParameters(undefined, undefined)).length).toBe(0);
  });

  it('verifies that _getParameters returns an object containing the id_token when the fragment portion of the URL is blank and the search portion of the URL contains the id_token', () => {
    const TOKEN = 'eyJ4NXQiOiJObUptT0dVeE16WmxZak0yWkRSaE5UWmxZVEExWXpkaFpUUmlPV0UwTldJMk0ySm1PVGMxWkEiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImF1ZCI6WyJoUDdwa3JXYUJQa2NPTERaVmJsel9JZ2VtVmthIl0sImF6cCI6ImhQN3BrcldhQlBrY09MRFpWYmx6X0lnZW1Wa2EiLCJhdXRoX3RpbWUiOjE0NzU1MjI4MDksImlzcyI6Imh0dHBzOlwvXC9sb2NhbGhvc3Q6OTQ0M1wvb2F1dGgyXC90b2tlbiIsInNuIjoiV29vZHdhcmQiLCJnaXZlbl9uYW1lIjoiRGF2aWQiLCJleHAiOjE0NzU1MjMxMDksIm5vbmNlIjoiNWE3MWM5ZmYtYjI1YS00YzE1LWEzNjgtNzdmODgwZWRkOWI2IiwiaWF0IjoxNDc1NTIyODA5fQ.B5KAglX92PPppP66yMkyzD1LA7qdWhrQWqYEOzJ0uFB_ZN8_u7G7Pp0qBy0Uilbh6AS0go64pzX5sxU72psHr6z2xVMJYm8-zjTb1GDVP3thUlZ1nEK-esUjSBLDnN1qKmMINtX82S3KIpAlehB1nZ94kbOHCoZ9v_k1rnTiWRA';
    const search = '?id_token=' + TOKEN + '&state=6777d1e8-6014-403d-ac0c-297dec5cc514';
    expect(auth._getParameters(undefined, search).id_token).toBe(TOKEN);
  });

  it('verifies that _getParameters returns an object containing the id_token when the fragment porion of the URL contains the access_token and the search portion of the URL is blank', () => {
    const TOKEN = '4dce1d4c-3828-3873-bdda-9b2ba2726ac4';
    const hash = '#/access_token=' + TOKEN + '&state=1120063b-8c7b-4fac-a121-a0e7e4ccb270&token_type=Bearer&expires_in=197&session_state=a41ac575b3d4c1b50acee40499a7efc1d46485913bd8520b13eebec6a657da3e.Vxrih14RiYpyTIs-X21-Pg';
    expect(auth._getParameters(hash, undefined).access_token).toBe(TOKEN);
  });

  it('verifies that _getParameters returns an object containing the id_token when the fragment portion of the URL contains the id_token and the search portion of the URL is blank.', () => {
    const hash = '#/' + VALID_URLFRAGMENT;
    expect(auth._getParameters(hash, undefined).id_token).toBe(IDTOKEN_MOCK);
  });

  it('verifies that _getParameters returns an object containing both the access_token and the id_token when the fragment poriton of the URL contains both the id_token and the access_token and the search portion of the URL is blank.', () => {
    const ID_TOKEN = 'eyJ4NXQiOiJObUptT0dVeE16WmxZak0yWkRSaE5UWmxZVEExWXpkaFpUUmlPV0UwTldJMk0ySm1PVGMxWkEiLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiQUI4Si1WaHlvbWxseTJBbktvN2dVUSIsInN1YiI6ImFkbWluIiwiYXVkIjpbImhQN3BrcldhQlBrY09MRFpWYmx6X0lnZW1Wa2EiXSwiYXpwIjoiaFA3cGtyV2FCUGtjT0xEWlZibHpfSWdlbVZrYSIsImF1dGhfdGltZSI6MTQ3NTUyMjUyMCwiaXNzIjoiaHR0cHM6XC9cL2xvY2FsaG9zdDo5NDQzXC9vYXV0aDJcL3Rva2VuIiwic24iOiJXb29kd2FyZCIsImdpdmVuX25hbWUiOiJEYXZpZCIsImV4cCI6MTQ3NTUyMjgyMCwibm9uY2UiOiI1NTRkMjE5Ny0yYTQzLTQzMGUtOGJmNy1kMjk5MTIxNjE5MDEiLCJpYXQiOjE0NzU1MjI1MjB9.WrTgmLsBuP6BG1v1aBs4dp3ONYEtuzlUySsG4ImpAVIBg9BJv_nc9NPDSK_IMxiKi7sHwJWzCzNLHUbOkmmZxTqIQt7KEs_Kx2ZBlf_Yvb_YPyAcUasBlX4BzHLq0nOAqax43fgholLLXPA4WZmBkDVw6piquPQ45uCJ8_Myezs';
    const ACCESS_TOKEN = 'eda1a60f-4dbd-3b8c-bfce-60d3980040a5';
    const hash = '#/access_token=' + ACCESS_TOKEN + '&id_token=' + ID_TOKEN + '&state=e60a53f8-fadc-477a-b51d-64e7c31b06e9&token_type=Bearer&expires_in=300&session_state=8cbc061a22547adff4c5f88a80de8999129997b8ff7c7c66c870a43d6d2a2d6a.enxHcp7nDHTPhFPWaY-l4g';
    const parameters = auth._getParameters(hash, undefined);
    expect(parameters.id_token).toBe(ID_TOKEN);
    expect(parameters.access_token).toBe(ACCESS_TOKEN);
  });
});
