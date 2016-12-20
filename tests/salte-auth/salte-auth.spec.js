import SalteAuth from '../../src/salte-auth.js';
import { expect } from 'chai';
import uuid from 'uuid';

// TODO: Refactor this out
mocha.setup({
  globals: [
    'AuthenticationContext'
  ]
});

describe('salte-auth', () => {
  let auth;
  const STORAGE_PREFIX = 'auth';
  const STORAGE_ACCESS_TOKEN_KEY = STORAGE_PREFIX + '.access.token.key';
  const STORAGE_EXPIRATION_KEY = STORAGE_PREFIX + '.expiration.key';
  const STORAGE_TOKEN_KEYS = STORAGE_PREFIX + '.token.keys';
  const RESOURCE1 = 'token.resource1';
  const SECONDS_TO_EXPIRE = Math.round(new Date().getTime() / 1000.0);
  const IDTOKEN_MOCK = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVUa0d0S1JrZ2FpZXpFWTJFc0xDMmdPTGpBNCJ9.eyJhdWQiOiJlOWE1YThiNi04YWY3LTQ3MTktOTgyMS0wZGVlZjI1NWY2OGUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLXBwZS5uZXQvNTJkNGIwNzItOTQ3MC00OWZiLTg3MjEtYmMzYTFjOTkxMmExLyIsImlhdCI6MTQxMTk1OTAwMCwibmJmIjoxNDExOTU5MDAwLCJleHAiOjE0MTE5NjI5MDAsInZlciI6IjEuMCIsInRpZCI6IjUyZDRiMDcyLTk0NzAtNDlmYi04NzIxLWJjM2ExYzk5MTJhMSIsImFtciI6WyJwd2QiXSwib2lkIjoiZmEzYzVmYTctN2Q5OC00Zjk3LWJmYzQtZGJkM2E0YTAyNDMxIiwidXBuIjoidXNlckBvYXV0aGltcGxpY2l0LmNjc2N0cC5uZXQiLCJ1bmlxdWVfbmFtZSI6InVzZXJAb2F1dGhpbXBsaWNpdC5jY3NjdHAubmV0Iiwic3ViIjoiWTdUbXhFY09IUzI0NGFHa3RjbWpicnNrdk5tU1I4WHo5XzZmbVc2NXloZyIsImZhbWlseV9uYW1lIjoiYSIsImdpdmVuX25hbWUiOiJ1c2VyIiwibm9uY2UiOiI4MGZmYTkwYS1jYjc0LTRkMGYtYTRhYy1hZTFmOTNlMzJmZTAiLCJwd2RfZXhwIjoiNTc3OTkxMCIsInB3ZF91cmwiOiJodHRwczovL3BvcnRhbC5taWNyb3NvZnRvbmxpbmUuY29tL0NoYW5nZVBhc3N3b3JkLmFzcHgifQ.WHsl8TH1rQ3dQbRkV0TS6GBVAxzNOpG3nGG6mpEBCwAOCbyW6qRsSoo4qq8I5IGyerDf2cvcS-zzatHEROpRC9dcpwkRm6ta5dFZuouFyZ_QiYVKSMwfzEC_FI-6p7eT8gY6FbV51bp-Ah_WKJqEmaXv-lqjIpgsMGeWDgZRlB9cPODXosBq-PEk0q27Be-_A-KefQacJuWTX2eEhECLyuAu-ETVJb7s19jQrs_LJXz_ISib4DdTKPa7XTBDJlVGdCI18ctB67XwGmGi8MevkeKqFI8dkykTxeJ0MXMmEQbE6Fw-gxmP7uJYbZ61Jqwsw24zMDMeXatk2VWMBPCuhA';
  const STATE = '33333333-3333-4333-b333-333333333333';
  const SESSION_STATE = '451c6916-27cf-4eae-81cd-accf96126398';
  const VALID_URLFRAGMENT = 'id_token=' + IDTOKEN_MOCK + '&state=' + STATE + '&session_state=' + SESSION_STATE;
  const INVALID_URLFRAGMENT = 'id_token' + IDTOKEN_MOCK + '&state=' + STATE + '&session_state=' + SESSION_STATE;

  let sandbox;
  beforeEach(() => {
    window.AuthenticationContext = null;
    window.parent.AuthenticationContext = null;
    sandbox = sinon.sandbox.create();
    uuid.v4 = sandbox.stub().returns('33333333-3333-4333-b333-333333333333');
    sessionStorage.clear();
    sessionStorage.setItem(STORAGE_ACCESS_TOKEN_KEY + RESOURCE1, 'access_token_in_cache' + RESOURCE1);
    sessionStorage.setItem(STORAGE_EXPIRATION_KEY + RESOURCE1, SECONDS_TO_EXPIRE); // seconds to expire

    sessionStorage.setItem(STORAGE_TOKEN_KEYS, RESOURCE1 + '|');

    auth = new SalteAuth({
      loginResource: 'defaultResource',
      url: 'https://login.microsoftonline.com/tenant/oauth2/',
      clientId: 'e9a5a8b6-8af7-4719-9821-0deef255f68e',
      tokenCallbackTimeout: '800'
    });
    sandbox.stub(auth, 'navigate');
    window.parent.AuthenticationContext = auth;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('function: getResourceForEndpoint', () => {
    it('gets specific resource for defined endpoint mapping', () => {
      auth.config.securedEndpoints = {
        a: 'resource for a'
      };
      expect(auth.getResourceForEndpoint('a')).to.equal('resource for a');
      expect(auth.getResourceForEndpoint('b')).to.equal(auth.config.loginResource);
    });

    it('gets default resource for empty endpoint mapping', () => {
      auth.config.securedEndpoints = null;
      expect(auth.getResourceForEndpoint('a')).to.equal('defaultResource');
      expect(auth.getResourceForEndpoint('b')).to.equal('defaultResource');
    });

    it('gets null resource for annonymous endpoints', () => {
      auth.config.anonymousEndpoints = ['app/views'];
      expect(auth.getResourceForEndpoint('app/views')).to.equal(null);
      expect(auth.getResourceForEndpoint('app/views/abc')).to.equal(null);
      expect(auth.getResourceForEndpoint('default/app/views/abc')).to.equal(null);
      expect(auth.getResourceForEndpoint('app/home')).to.equal('defaultResource');
    });

    it('test get resource for endpoint from app backend', () => {
      auth.config.redirectUri = 'https://host.com/page';
      expect(auth.getResourceForEndpoint('https://host.com')).to.equal(auth.config.loginResource);
      expect(auth.getResourceForEndpoint('https://host.com/a/b')).to.equal(auth.config.loginResource);
      expect(auth.getResourceForEndpoint('https://host.com/page/')).to.equal(auth.config.loginResource);
      expect(auth.getResourceForEndpoint('https://notapp.com/page/')).to.equal(null);
      expect(auth.getResourceForEndpoint('/api/todo')).to.equal(auth.config.loginResource);
    });
  });

  describe('function: getCachedToken', () => {
    it('should not be expired if we are before the expiration time', () => {
      auth.config.expireOffsetSeconds = -100;
      expect(auth.getCachedToken(RESOURCE1)).to.equal('access_token_in_cache' + RESOURCE1);
    });

    it('should be expired if we are equal to the expiration time', () => {
      auth.config.expireOffsetSeconds = 0;
      expect(auth.getCachedToken(RESOURCE1)).to.equal(null);
    });

    it('should be expired if we are greater than the expiration time', () => {
      auth.config.expireOffsetSeconds = 100;
      expect(auth.getCachedToken(RESOURCE1)).to.equal(null);
    });
  });

  describe('function: getCachedUser', () => {
    it('should return the cached user', () => {
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.IDTOKEN, IDTOKEN_MOCK);
      expect(auth.getCachedUser()).to.deep.equal({
        userName: 'user@oauthimplicit.ccsctp.net',
        profile: {
          aud: 'e9a5a8b6-8af7-4719-9821-0deef255f68e',
          iss: 'https://sts.windows-ppe.net/52d4b072-9470-49fb-8721-bc3a1c9912a1/',
          iat: 1411959000,
          nbf: 1411959000,
          exp: 1411962900,
          ver: '1.0',
          tid: '52d4b072-9470-49fb-8721-bc3a1c9912a1',
          amr: [
            'pwd'
          ],
          oid: 'fa3c5fa7-7d98-4f97-bfc4-dbd3a4a02431',
          upn: 'user@oauthimplicit.ccsctp.net',
          unique_name: 'user@oauthimplicit.ccsctp.net',
          sub: 'Y7TmxEcOHS244aGktcmjbrskvNmSR8Xz9_6fmW65yhg',
          family_name: 'a',
          given_name: 'user',
          nonce: '80ffa90a-cb74-4d0f-a4ac-ae1f93e32fe0',
          pwd_exp: '5779910',
          pwd_url: 'https://portal.microsoftonline.com/ChangePassword.aspx'
        }
      });
    });
  });

  describe('function: login', () => {
    beforeEach(() => {
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.USERNAME, 'test user');
      auth.config.clientId = 'client';
      auth.config.redirectUri = 'contoso_site';
    });

    it('should navigate the user to login by default', () => {
      sandbox.spy(auth, 'promptUser');
      auth.login();
      expect(auth.promptUser.calledWith('https://login.microsoftonline.com/tenant/oauth2/authorize' +
        '?response_type=id_token' +
        '&client_id=client&redirect_uri=contoso_site' +
        '&state=33333333-3333-4333-b333-333333333333' +
        '&client-request-id=33333333-3333-4333-b333-333333333333' + auth._addLibMetadata() +
        '&nonce=33333333-3333-4333-b333-333333333333')).to.equal(true);
      expect(auth.config.state).to.equal('33333333-3333-4333-b333-333333333333');
    });

    it('should set loginInProgress to true', () => {
      auth.login();
      expect(auth.loginInProgress()).to.equal(true);
    });

    it('should call displayCall if provided', () => {
      auth.config.displayCall = sandbox.spy();
      auth._loginInProgress = false;
      auth.login();
      expect(auth.config.displayCall.calledWith('https://login.microsoftonline.com/tenant/oauth2/authorize' +
        '?response_type=id_token' +
        '&client_id=client' +
        '&redirect_uri=contoso_site' +
        '&state=33333333-3333-4333-b333-333333333333' +
        '&client-request-id=33333333-3333-4333-b333-333333333333' +
        auth._addLibMetadata() +
        '&nonce=33333333-3333-4333-b333-333333333333')).to.equal(true);
      expect(auth.config.state).to.equal('33333333-3333-4333-b333-333333333333');
    });

    it('tests if callback is called after login, if popup window is null', () => {
      auth.popUp = true;
      auth.config.clientId = 'client';
      auth.config.redirectUri = 'contoso_site';
      const callback = sandbox.spy();
      sandbox.stub(auth, 'open').returns(null);
      auth.callback = callback;
      auth.login();
      expect(callback.callCount).to.equal(1);
      expect(callback.calledWith('Popup Window is null. This can happen if you are using IE', null)).to.equal(true);
      expect(auth.loginInProgress()).to.equal(false);
    });

    it('tests login functionality in case of popup window', (done) => {
      sandbox.stub(window, 'setInterval', (method) => {
        method();
      });
      auth.popUp = true;
      auth.config.clientId = 'client';
      auth.config.redirectUri = 'contoso_site';
      let popupWindow;
      sandbox.stub(auth, 'open', () => {
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
      });
      const callback = (error, token) => {
        sessionStorage.setItem(auth.CONSTANTS.STORAGE.LOGIN_REQUEST, 'home page');
        expect(auth.loginInProgress()).to.equal(false);
        expect(token).to.equal(IDTOKEN_MOCK);
        expect(window.location.href).not.to.equal('home page');
        done();
      };
      auth.callback = callback;
      uuid.v4 = sandbox.stub().returns('33333333-3333-4333-b333-333333333333');

      auth.login();
    });
  });

  describe('function: acquireToken', function() {
    this.timeout(10000);
    it('returns from cache for auto renewable if not expired', (done) => {
      auth.config.expireOffsetSeconds = -100;

      auth.acquireToken(RESOURCE1, (error, token) => {
        expect(error).to.equal(null);
        expect(token).to.equal('access_token_in_cache' + RESOURCE1);
        done();
      });
    });

    it('returns error for acquireToken without resource', (done) => {
      auth.config.expireOffsetSeconds = -100;

      auth.acquireToken(null, (error, token) => {
        expect(error).to.equal('resource is required');
        expect(token).to.equal(null);
        done();
      });
    });

    it('attempts to renew if token expired and renew is allowed', (done) => {
      auth.config.redirectUri = 'contoso_site';
      auth.config.clientId = 'client';
      auth.config.expireOffsetSeconds = 100;
      auth._renewStates = [];
      auth._user = {
        profile: {
          upn: 'test@testuser.com'
        },
        userName: 'test@domain.com'
      };
      auth.acquireToken(RESOURCE1, (error, token) => {
        expect(document.getElementById('authRenewFrame' + RESOURCE1).src).to.equal('https://login.microsoftonline.com/tenant/oauth2/authorize' +
          '?response_type=token' +
          '&client_id=client' +
          '&resource=' + RESOURCE1 +
          '&redirect_uri=contoso_site' +
          '&state=33333333-3333-4333-b333-333333333333%7Ctoken.resource1' +
          '&client-request-id=33333333-3333-4333-b333-333333333333' + auth._addLibMetadata() +
          '&prompt=none' +
          '&login_hint=test%40testuser.com' +
          '&domain_hint=testuser.com');
        done();
      });
      expect(sessionStorage.getItem(auth.CONSTANTS.STORAGE.LOGIN_REQUEST)).to.equal('');
      expect(auth._renewStates.length).to.equal(1);
    });

    // Necessary for integration with Angular when multiple http calls are queued.
    it('allows multiple callers to be notified when the token is renewed. Also checks if all registered acquireToken callbacks are called in the case when one of the callbacks throws an error', (done) => {
      auth.config.redirectUri = 'contoso_site';
      auth.config.clientId = 'client';
      auth.config.expireOffsetSeconds = 100;
      const callback = sandbox.spy(() => {
        throw new Error('Error occurred in callback function');
      });
      const callback2 = sandbox.spy();

      auth._renewStates = [];
      auth._user = { profile: { upn: 'test@testuser.com' }, userName: 'test@domain.com' };
      auth.acquireToken(RESOURCE1, callback);

      // Simulate second acquire i.e. second service call from Angular.
      auth.acquireToken(RESOURCE1, callback2);
      expect(sessionStorage.getItem(auth.CONSTANTS.STORAGE.LOGIN_REQUEST)).to.equal('');
      expect(auth._renewStates.length).to.equal(1);

      // TODO: These need to be swapped out because timeouts aren't reliable. :(
      // Also they cause the tests to take quite a bit longer
      setTimeout(() => {
        expect(callback.callCount).to.equal(1);
        expect(callback.calledWith(null, '33333333-3333-4333-b333-333333333333')).to.equal(true);

        expect(callback2.callCount).to.equal(1);
        expect(callback2.calledWith(null, '33333333-3333-4333-b333-333333333333')).to.equal(true);
        expect(document.getElementById('authRenewFrame' + RESOURCE1).src).to.equal('https://login.microsoftonline.com/tenant/oauth2/authorize' +
          '?response_type=token' +
          '&client_id=client' +
          '&resource=' + RESOURCE1 +
          '&redirect_uri=contoso_site' +
          '&state=33333333-3333-4333-b333-333333333333%7Ctoken.resource1' +
          '&client-request-id=33333333-3333-4333-b333-333333333333' + auth._addLibMetadata() +
          '&prompt=none&login_hint=test%40testuser.com' +
          '&domain_hint=testuser.com');
        done();
      }, 2000);
      // We need to simulate the callback since we're mocking out location.replace
      auth.callBackMappedToRenewStates[auth.config.state](null, '33333333-3333-4333-b333-333333333333');
    });

    it('tests that callbacks are called when renewal token request was canceled', (done) => {
      auth.config.expireOffsetSeconds = SECONDS_TO_EXPIRE + 100;
      const callback = (error, token) => {
        expect(sessionStorage.getItem(auth.CONSTANTS.STORAGE.RENEW_STATUS + RESOURCE1)).to.equal(auth.CONSTANTS.TOKEN_RENEW_STATUS_CANCELED);
        expect(error).to.equal('Token renewal operation failed due to timeout');
        expect(token).to.equal(null);
        done();
      };
      auth._renewStates = [];
      auth._user = { userName: 'test@testuser.com' };
      auth.acquireToken(RESOURCE1, callback);
    });

    it('attempts to renew idToken if token expired and renew is allowed', (done) => {
      auth.config.redirectUri = 'contoso_site';
      auth.config.clientId = 'client';
      auth.config.expireOffsetSeconds = SECONDS_TO_EXPIRE + 100;
      auth.config.tenant = 'testtenant';
      auth._renewStates = [];
      auth._user = { profile: { upn: 'test@testuser.com' }, userName: 'test@domain.com' };
      auth.acquireToken(auth.config.clientId, sandbox.spy());
      expect(sessionStorage.getItem(auth.CONSTANTS.STORAGE.NONCE_IDTOKEN)).to.equal('33333333-3333-4333-b333-333333333333');
      expect(auth.config.state).to.equal('33333333-3333-4333-b333-333333333333|client');
      expect(auth._renewStates.length).to.equal(1);
      expect(sessionStorage.getItem(auth.CONSTANTS.STORAGE.LOGIN_REQUEST)).to.equal('');

      setTimeout(() => {
        expect(document.querySelector('#authIdTokenFrame').src).to.equal('https://login.microsoftonline.com/tenant/oauth2/authorize?response_type=id_token&client_id=' + auth.config.clientId + '&redirect_uri=contoso_site&state=33333333-3333-4333-b333-333333333333%7Cclient' +
          '&client-request-id=33333333-3333-4333-b333-333333333333' + auth._addLibMetadata() + '&prompt=none&login_hint=test%40testuser.com&domain_hint=testuser.com&nonce=33333333-3333-4333-b333-333333333333');
        done();
      }, 2000);
    });

    it('use the same correlationId for each request sent to AAD if set by user', (done) => {
      auth.config.correlationId = '33333333-3333-4333-b333-333333333333';
      auth.config.redirectUri = 'contoso_site';
      auth.config.clientId = 'client';
      auth.config.expireOffsetSeconds = SECONDS_TO_EXPIRE + 100;
      auth._renewStates = [];
      auth._user = { profile: { upn: 'test@testuser.com' }, userName: 'test@domain.com' };
      sandbox.spy(auth, '_loadFrameTimeout');
      auth.acquireToken(RESOURCE1, sandbox.spy());
      expect(auth._loadFrameTimeout.calledWith('https://login.microsoftonline.com/tenant/oauth2/authorize' +
        '?response_type=token' +
        '&client_id=client' +
        '&resource=' + RESOURCE1 +
        '&redirect_uri=contoso_site' +
        '&state=33333333-3333-4333-b333-333333333333%7Ctoken.resource1' +
        '&client-request-id=33333333-3333-4333-b333-333333333333' + auth._addLibMetadata() +
        '&prompt=none&login_hint=test%40testuser.com' +
        '&domain_hint=testuser.com',
        'authRenewFrametoken.resource1',
        'token.resource1')).to.equal(true);
      auth._activeRenewals = {};
      auth._user = { profile: { sub: 'test@testuser.com' }, userName: 'test@domain.com' };
      auth.acquireToken(RESOURCE1, () => done());
      expect(auth._loadFrameTimeout.calledWith('https://login.microsoftonline.com/tenant/oauth2/authorize' +
        '?response_type=token' +
        '&client_id=client' +
        '&resource=' + RESOURCE1 +
        '&redirect_uri=contoso_site' +
        '&state=33333333-3333-4333-b333-333333333333%7Ctoken.resource1' +
        '&client-request-id=33333333-3333-4333-b333-333333333333' + auth._addLibMetadata() +
        '&prompt=none',
        'authRenewFrametoken.resource1',
        'token.resource1')).to.equal(true);
    });

    it('generates new correlationId for each request sent to AAD if not set by user', (done) => {
      auth.config.correlationId = null;
      auth.config.redirectUri = 'contoso_site';
      auth.config.clientId = 'client';
      auth.config.expireOffsetSeconds = SECONDS_TO_EXPIRE + 100;
      auth._renewStates = [];
      auth._user = { profile: { upn: 'test@testuser.com' }, userName: 'test@domain.com' };
      uuid.v4 = sandbox.stub().returns('11111111-1111-4111-9111-111111111111');
      sandbox.spy(auth, '_loadFrameTimeout');
      auth.acquireToken(RESOURCE1, sandbox.spy());
      expect(auth._loadFrameTimeout.calledWith('https://login.microsoftonline.com/tenant/oauth2/authorize' +
        '?response_type=token' +
        '&client_id=client' +
        '&resource=' + RESOURCE1 +
        '&redirect_uri=contoso_site' +
        '&state=11111111-1111-4111-9111-111111111111%7Ctoken.resource1' +
        '&client-request-id=11111111-1111-4111-9111-111111111111' + auth._addLibMetadata() +
        '&prompt=none&login_hint=test%40testuser.com' +
        '&domain_hint=testuser.com',
        'authRenewFrametoken.resource1',
        'token.resource1')).to.equal(true);

      uuid.v4 = sandbox.stub().returns('44444444-4444-4444-8444-444444444444');
      auth._activeRenewals = {};
      auth._user = { profile: { sub: 'test@testuser.com' }, userName: 'test@domain.com' };
      auth.acquireToken(RESOURCE1, sandbox.spy());
      expect(auth._loadFrameTimeout.calledWith('https://login.microsoftonline.com/tenant/oauth2/authorize' +
        '?response_type=token' +
        '&client_id=client' +
        '&resource=' + RESOURCE1 +
        '&redirect_uri=contoso_site' +
        '&state=44444444-4444-4444-8444-444444444444%7Ctoken.resource1' +
        '&client-request-id=44444444-4444-4444-8444-444444444444' + auth._addLibMetadata() +
        '&prompt=none',
        'authRenewFrametoken.resource1',
        'token.resource1')).to.equal(true);

      setTimeout(() => {
        done();
      }, 2000);
    });
  });

  describe('function: promptUser', () => {
    it('prompts user if url is given', () => {
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.USERNAME, 'test user');
      auth.promptUser();
      expect(auth.navigate.callCount).to.equal(0);
      auth.promptUser('test');
      expect(auth.navigate.callCount).to.equal(1);
    });

    it('checks if Logging is defined on window', () => {
      window.Logging = {
        level: 2,
        log: sandbox.spy()
      };

      auth.promptUser();

      expect(window.Logging.log.callCount).to.equal(1);
      expect(window.Logging.log.getCall(0).args[0]).to.contain('Navigate url is empty');
    });
  });

  describe('function: clearCache', () => {
    it('clears cache', () => {
      // Keys are stored for each resource to map tokens for resource
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.TOKEN_KEYS, 'key1|key2|' + RESOURCE1 + '|');
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + 'key1', 'value1');
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + 'key2', 'value2');
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.EXPIRATION_KEY, 3);
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.EXPIRATION_KEY, 3);
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.SESSION_STATE, 'session_state');
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.STATE_LOGIN, 'state login');
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.USERNAME, 'username');
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.ERROR, 'error');
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.ERROR_DESCRIPTION, 'error description');
      auth.clearCache();
      for (let i = 0; i < sessionStorage.length; i++) {
        expect(Boolean(sessionStorage[i])).to.equal(false);
      }
    });

    it('clears cache for a resource', () => {
      // Keys are stored for each resource to map tokens for resource
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.TOKEN_KEYS, 'key1|' + RESOURCE1 + '|');
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + 'key1', 'value1');
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.EXPIRATION_KEY + 'key1', 3);
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.STATE_RENEW, 'state renew');
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.ERROR, 'error');
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.ERROR_DESCRIPTION, 'error description');
      auth.clearCacheForResource(RESOURCE1);
      expect(sessionStorage[auth.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + RESOURCE1]).to.equal('');
      expect(sessionStorage[auth.CONSTANTS.STORAGE.EXPIRATION_KEY + RESOURCE1]).to.equal('0');
      expect(sessionStorage[auth.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + 'key1']).to.equal('value1');
    });
  });

  describe('function: logOut', () => {
    beforeEach(() => {
      sandbox.stub(auth, 'clearCache');
      sandbox.stub(auth, 'promptUser');
      auth.config.clientId = 'client';
    });

    it('clears cache before logout', () => {
      auth.config.redirectUri = 'contoso_site';
      auth.logOut();
      expect(auth.clearCache.callCount).to.equal(1);
      expect(auth.promptUser.callCount).to.equal(1);
    });

    it('should redirect after logout if provided', () => {
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.USERNAME, 'test user');
      auth.config.postLogoutRedirectUri = 'https://contoso.com/logout';
      auth.logOut();
      expect(auth.promptUser.callCount).to.equal(1);
      expect(auth.promptUser.calledWith('https://login.microsoftonline.com/tenant/oauth2/logout?post_logout_redirect_uri=https%3A%2F%2Fcontoso.com%2Flogout')).to.equal(true);
    });
  });

  describe('function: getUser', () => {
    it('gets user from cache', (done) => {
      function callback(error, user) {
        expect(user.userName).to.equal('user@oauthimplicit.ccsctp.net');
        done();
      }
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.IDTOKEN, IDTOKEN_MOCK);
      auth.config.clientId = 'e9a5a8b6-8af7-4719-9821-0deef255f68e';
      auth.config.loginResource = RESOURCE1;
      auth.config.expireOffsetSeconds = SECONDS_TO_EXPIRE - 100;
      auth.getCachedToken = sandbox.spy();

      auth.getUser(callback);

      expect(auth.getCachedToken.calledWith(RESOURCE1)).to.equal(false);
    });

    it('ensures that auth.callback is not overridden in calls to getUser', () => {
      const callback = sandbox.spy();
      auth._user = { profile: { upn: 'test@testuser.com' }, userName: 'test@domain.com' };

      auth.getUser(callback);

      expect(callback.callCount).to.equal(1);
      expect(callback.calledWith(null, auth._user)).to.equal(true);
      expect(auth.callback).to.equal(null);
    });
  });

  describe('function: isCallback', () => {
    it('is callback if has error or access token or idtoken', () => {
      expect(auth.isCallback('not a callback')).to.equal(false);
      expect(auth.isCallback('#error_description=someting_wrong')).to.equal(true);
      expect(auth.isCallback('#/error_description=someting_wrong')).to.equal(true);
      expect(auth.isCallback('#access_token=token123')).to.equal(true);
      expect(auth.isCallback('#id_token=idtoken234')).to.equal(true);
    });

    it('verifies that isCallback returns false if both the fragment and search portions of the URL are blank', () => {
      expect(auth.isCallback(undefined, undefined)).to.equal(false);
    });

    it('verifies that isCallback returns true if the fragment portion of the URL contains an id_token and the search portion is blank', () => {
      const hash = '#/' + VALID_URLFRAGMENT;
      expect(auth.isCallback(hash, undefined)).to.equal(true);
    });

    it('verifies that isCallback returns true if a hashPrefix is present and the fragment portion of the URL contains an id_token and the search portion is blank', () => {
      const hash = '#!/' + VALID_URLFRAGMENT;
      auth.config.hashPrefix = '!';
      expect(auth.isCallback(hash, undefined)).to.equal(true);
    });

    it('verifies that isCallback returns true if the fragment portion of the URL is blank and the search portion contains an id_token', () => {
      const search = '?id_token=eyJ4NXQiOiJObUptT0dVeE16WmxZak0yWkRSaE5UWmxZVEExWXpkaFpUUmlPV0UwTldJMk0ySm1PVGMxWkEiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImF1ZCI6WyJoUDdwa3JXYUJQa2NPTERaVmJsel9JZ2VtVmthIl0sImF6cCI6ImhQN3BrcldhQlBrY09MRFpWYmx6X0lnZW1Wa2EiLCJhdXRoX3RpbWUiOjE0NzU1MjI4MDksImlzcyI6Imh0dHBzOlwvXC9sb2NhbGhvc3Q6OTQ0M1wvb2F1dGgyXC90b2tlbiIsInNuIjoiV29vZHdhcmQiLCJnaXZlbl9uYW1lIjoiRGF2aWQiLCJleHAiOjE0NzU1MjMxMDksIm5vbmNlIjoiNWE3MWM5ZmYtYjI1YS00YzE1LWEzNjgtNzdmODgwZWRkOWI2IiwiaWF0IjoxNDc1NTIyODA5fQ.B5KAglX92PPppP66yMkyzD1LA7qdWhrQWqYEOzJ0uFB_ZN8_u7G7Pp0qBy0Uilbh6AS0go64pzX5sxU72psHr6z2xVMJYm8-zjTb1GDVP3thUlZ1nEK-esUjSBLDnN1qKmMINtX82S3KIpAlehB1nZ94kbOHCoZ9v_k1rnTiWRA&state=6777d1e8-6014-403d-ac0c-297dec5cc514';
      expect(auth.isCallback(undefined, search)).to.equal(true);
    });

    it('verifies that isCallback returns true if the fragment portion of the URL contains a access_token and the search portion is blank', () => {
      const hash = '#/access_token=4dce1d4c-3828-3873-bdda-9b2ba2726ac4&state=1120063b-8c7b-4fac-a121-a0e7e4ccb270&token_type=Bearer&expires_in=197&session_state=a41ac575b3d4c1b50acee40499a7efc1d46485913bd8520b13eebec6a657da3e.Vxrih14RiYpyTIs-X21-Pg';
      expect(auth.isCallback(hash, undefined)).to.equal(true);
    });

    it('verifies that isCallback returns true if the fragment portion of the URL contains both a access_token and an id_token (after embedded question mark) and the search portion is blank', () => {
      const hash = '#/access_token=eda1a60f-4dbd-3b8c-bfce-60d3980040a5&id_token=eyJ4NXQiOiJObUptT0dVeE16WmxZak0yWkRSaE5UWmxZVEExWXpkaFpUUmlPV0UwTldJMk0ySm1PVGMxWkEiLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiQUI4Si1WaHlvbWxseTJBbktvN2dVUSIsInN1YiI6ImFkbWluIiwiYXVkIjpbImhQN3BrcldhQlBrY09MRFpWYmx6X0lnZW1Wa2EiXSwiYXpwIjoiaFA3cGtyV2FCUGtjT0xEWlZibHpfSWdlbVZrYSIsImF1dGhfdGltZSI6MTQ3NTUyMjUyMCwiaXNzIjoiaHR0cHM6XC9cL2xvY2FsaG9zdDo5NDQzXC9vYXV0aDJcL3Rva2VuIiwic24iOiJXb29kd2FyZCIsImdpdmVuX25hbWUiOiJEYXZpZCIsImV4cCI6MTQ3NTUyMjgyMCwibm9uY2UiOiI1NTRkMjE5Ny0yYTQzLTQzMGUtOGJmNy1kMjk5MTIxNjE5MDEiLCJpYXQiOjE0NzU1MjI1MjB9.WrTgmLsBuP6BG1v1aBs4dp3ONYEtuzlUySsG4ImpAVIBg9BJv_nc9NPDSK_IMxiKi7sHwJWzCzNLHUbOkmmZxTqIQt7KEs_Kx2ZBlf_Yvb_YPyAcUasBlX4BzHLq0nOAqax43fgholLLXPA4WZmBkDVw6piquPQ45uCJ8_Myezs&state=e60a53f8-fadc-477a-b51d-64e7c31b06e9&token_type=Bearer&expires_in=300&session_state=8cbc061a22547adff4c5f88a80de8999129997b8ff7c7c66c870a43d6d2a2d6a.enxHcp7nDHTPhFPWaY-l4g';
      expect(auth.isCallback(hash, undefined)).to.equal(true);
    });

    it('verifies that _getParameters returns an empty object if both the fragment and search portions of the URL are blank', () => {
      expect(Object.getOwnPropertyNames(auth._getParameters(undefined, undefined)).length).to.equal(0);
    });
  });

  describe('function: getLoginError', () => {
    it('gets login error if any recorded', () => {
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.LOGIN_ERROR, '');
      expect(auth.getLoginError()).to.equal('');
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.LOGIN_ERROR, 'err');
      expect(auth.getLoginError()).to.equal('err');
    });
  });

  describe('function: getRequestInfo', () => {
    it('gets request info from hash', () => {
      let requestInfo = auth.getRequestInfo('invalid');
      expect(requestInfo.valid).to.equal(false);
      requestInfo = auth.getRequestInfo('#error_description=someting_wrong');
      expect(requestInfo.valid).to.equal(true);
      expect(requestInfo.stateResponse).to.equal('');

      requestInfo = auth.getRequestInfo('#error_description=someting_wrong&state=1232');
      expect(requestInfo.valid).to.equal(true);
      expect(requestInfo.stateResponse).to.equal('1232');
      expect(requestInfo.stateMatch).to.equal(false);

      sessionStorage.setItem(auth.CONSTANTS.STORAGE.STATE_LOGIN, '1234');
      auth._renewStates.push('1234');
      requestInfo = auth.getRequestInfo('#error_description=someting_wrong&state=1234');
      expect(requestInfo.valid).to.equal(true);
      expect(requestInfo.stateResponse).to.equal('1234');
      expect(requestInfo.stateMatch).to.equal(true);
      expect(requestInfo.requestType).to.equal(auth.REQUEST_TYPE.LOGIN);
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.STATE_LOGIN, '');
    });
  });

  describe('function: saveTokenFromHash', () => {
    it('saves errors token from callback', () => {
      const requestInfo = {
        valid: false,
        parameters: { error_description: 'error description', error: 'invalid' },
        stateMatch: false,
        stateResponse: '',
        requestType: auth.REQUEST_TYPE.UNKNOWN
      };
      auth.saveTokenFromHash(requestInfo);

      expect(sessionStorage.getItem(auth.CONSTANTS.STORAGE.ERROR)).to.equal('invalid');
      expect(sessionStorage.getItem(auth.CONSTANTS.STORAGE.ERROR_DESCRIPTION)).to.equal('error description');
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

      expect(sessionStorage.getItem(auth.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + 'loginResource1')).to.equal('token123');
    });

    // TODO: This uses date and for some reason it periodically fails on Firefox
    it('saves expiry if state matches', () => {
      sandbox.stub(auth, '_now').returns(3589);
      const requestInfo = {
        valid: true,
        parameters: { access_token: 'token123', state: '123', expires_in: 3589 },
        stateMatch: true,
        stateResponse: '123|loginResource1',
        requestType: auth.REQUEST_TYPE.RENEW_TOKEN
      };
      auth.saveTokenFromHash(requestInfo);
      expect(sessionStorage.getItem(auth.CONSTANTS.STORAGE.EXPIRATION_KEY + 'loginResource1')).to.equal('7178');
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
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.NONCE_IDTOKEN, '19e67b24-cd99-45b6-a588-840e3f8f2a70');
      auth.saveTokenFromHash(requestInfo);
      const cachedUser = auth.getCachedUser();
      expect(cachedUser.userName).to.equal('user@oauthimplicit.ccsctp.net');
      expect(cachedUser.profile.upn).to.equal('user@oauthimplicit.ccsctp.net');
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
      auth.saveTokenFromHash(requestInfo);
      expect(auth.getCachedUser()).to.equal(null);
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

      expect(sessionStorage.getItem(auth.CONSTANTS.STORAGE.USERNAME)).to.equal(null);
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

      expect(sessionStorage.getItem(auth.CONSTANTS.STORAGE.ERROR_DESCRIPTION)).to.equal('Invalid_state. state: ' + requestInfo.stateResponse);
    });
  });

  describe('function: _getHostFromUri', () => {
    it('test host extraction', () => {
      expect(auth._getHostFromUri('https://a.com/b/c')).to.equal('a.com');
      expect(auth._getHostFromUri('http://a.com')).to.equal('a.com');
      expect(auth._getHostFromUri('a.com/b/c')).to.equal('a.com');
      expect(auth._getHostFromUri('http://a.com/')).to.equal('a.com');
      expect(auth._getHostFromUri('http://localhost:8080')).to.equal('localhost:8080');
    });
  });

  describe('function: _decodeJwt', () => {
    it('test decode jwt', () => {
      expect(auth._decodeJwt('')).to.equal(null);
      expect(auth._decodeJwt(null)).to.equal(null);
    });
  });

  describe('function: _loadFrameTimeout', function() {
    this.timeout(10000);
    it('tests the load frame timeout method', (done) => {
      auth._activeRenewals[RESOURCE1] = 'example';
      auth.callBackMappedToRenewStates.example = function() {
        expect(sessionStorage.getItem(auth.CONSTANTS.STORAGE.RENEW_STATUS + RESOURCE1)).to.equal(auth.CONSTANTS.TOKEN_RENEW_STATUS_CANCELED);
        auth._loadFrameTimeout('urlnavigation', 'frameName', RESOURCE1);
        expect(sessionStorage.getItem(auth.CONSTANTS.STORAGE.RENEW_STATUS + RESOURCE1)).to.equal(auth.CONSTANTS.TOKEN_RENEW_STATUS_IN_PROGRESS);
        const requestInfo = {
          valid: true,
          parameters: { access_token: 'token123', state: '123', expires_in: '23' },
          stateMatch: true,
          stateResponse: '64532|' + RESOURCE1,
          requestType: auth.REQUEST_TYPE.RENEW_TOKEN
        };
        auth.saveTokenFromHash(requestInfo);
        expect(sessionStorage.getItem(auth.CONSTANTS.STORAGE.RENEW_STATUS + RESOURCE1)).to.equal(auth.CONSTANTS.TOKEN_RENEW_STATUS_COMPLETED);
        done();
      };

      auth._loadFrameTimeout('urlnavigation', 'frameName', RESOURCE1);

      expect(sessionStorage.getItem(auth.CONSTANTS.STORAGE.RENEW_STATUS + RESOURCE1)).to.equal(auth.CONSTANTS.TOKEN_RENEW_STATUS_IN_PROGRESS);
    });
  });

  describe('function: handleWindowCallback', () => {
    it('tests handleWindowCallback function for RENEW_TOKEN', (done) => {
      function callback(error, token) {
        expect(error).to.equal('error description');
        expect(token).to.equal(IDTOKEN_MOCK);
        done();
      }
      location.hash = '#/id_token=' + IDTOKEN_MOCK;
      auth.getRequestInfo = (hash) => {
        return {
          valid: true,
          parameters: { error_description: 'error description', error: 'invalid', id_token: IDTOKEN_MOCK, session_state: '61ae5247-eaf8-4496-a667-32b0acbad7a0', state: '19537a2a-e9e7-489d-ae7d-3eefab9e4137' },
          stateMatch: true,
          stateResponse: '19537a2a-e9e7-489d-ae7d-3eefab9e4137',
          requestType: auth.REQUEST_TYPE.RENEW_TOKEN
        };
      };
      sandbox.stub(auth, 'isIframe').returns(true);
      auth.callBackMappedToRenewStates[auth.getRequestInfo().stateResponse] = callback;
      auth.handleWindowCallback();
    });

    it('tests handleWindowCallback function for LOGIN_REQUEST', () => {
      location.hash = '#/id_token=' + IDTOKEN_MOCK;
      auth.getRequestInfo = () => {
        return {
          valid: true,
          parameters: { error_description: 'error description', error: 'invalid', id_token: IDTOKEN_MOCK, session_state: '61ae5247-eaf8-4496-a667-32b0acbad7a0', state: '19537a2a-e9e7-489d-ae7d-3eefab9e4137' },
          stateMatch: true,
          stateResponse: '19537a2a-e9e7-489d-ae7d-3eefab9e4137',
          requestType: auth.REQUEST_TYPE.LOGIN_REQUEST
        };
      };
      sessionStorage.setItem(auth.CONSTANTS.STORAGE.LOGIN_REQUEST, 'www.test.com');
      auth.handleWindowCallback();
      expect(auth.navigate.calledWith('www.test.com')).to.equal(true);
    });
  });

  describe('function: deserialize', () => {
    // TODO: Figure out what sort of shenanigans this test is doing... :/
    it('checks the deserialize method for extracting idToken', () => {
      let obj = auth._deserialize(VALID_URLFRAGMENT);
      expect(obj.id_token).to.equal(IDTOKEN_MOCK);
      expect(obj.state).to.equal(STATE);
      expect(obj.session_state).to.equal(SESSION_STATE);

      obj = auth._deserialize(INVALID_URLFRAGMENT);
      expect(obj.id_token).to.be.undefined;
      expect(obj.state).to.equal(STATE);
      expect(obj.session_state).to.equal(SESSION_STATE);
      expect(obj['id_token' + IDTOKEN_MOCK]).to.be.undefined;

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
      expect(obj['id_token' + IDTOKEN_MOCK]).to.equal('');// This additional property is parsed because of ? operator in regex
      expect(obj.id_token).to.be.undefined;
      expect(obj.state).to.equal(STATE);
      expect(obj.session_state).to.equal(SESSION_STATE);
    });
  });

  describe('function: _initResponseType', () => {
    it('verifies _getNavigateUrl() returns the correct value when tenant and rootContext are undefined, and scope and responseType are not truthy', () => {
      auth.config.tenant = undefined;
      auth.config.rootContext = undefined;
      auth.config.scope = '';
      auth.config.responseType = '';
      auth.setResponseType();
      auth.config.clientId = 'the_client_id';
      auth.config.redirectUri = 'the_redirect_uri';
      auth.config.state = 'the_state';
      auth.config.correlationId = 'the_correlation_id';
      expect(auth._getNavigateUrl(auth.config.responseType, '')).to.match(/https:\/\/login\.microsoftonline\.com\/tenant\/oauth2\/authorize\?response_type=id_token&client_id=the_client_id&redirect_uri=the_redirect_uri&state=the_state&client-request-id=the_correlation_id.*/);
    });

    it('verifies _getNavigateUrl() returns the correct value when scope and responseType are not truthy', () => {
      auth.config.url = 'https://login.microsoftonline.com/contoso/oauth2/';
      auth.config.scope = '';
      auth.setResponseType('');
      auth.config.clientId = 'the_client_id';
      auth.config.redirectUri = 'the_redirect_uri';
      auth.config.state = 'the_state';
      auth.config.correlationId = 'the_correlation_id';
      expect(auth._getNavigateUrl(auth.config.responseType, '')).to.match(/https:\/\/login\.microsoftonline\.com\/contoso\/oauth2\/authorize\?response_type=id_token&client_id=the_client_id&redirect_uri=the_redirect_uri&state=the_state&client-request-id=the_correlation_id.*/);
    });

    it('verifies _getNavigateUrl() returns the correct value when scope is not truthy and responseType is truthy', () => {
      auth.config.url = 'https://login.microsoftonline.com/contoso/oauth2/';
      auth.config.scope = '';
      auth.setResponseType('id_token token');
      auth.config.clientId = 'the_client_id';
      auth.config.redirectUri = 'the_redirect_uri';
      auth.config.state = 'the_state';
      auth.config.correlationId = 'the_correlation_id';
      expect(auth._getNavigateUrl(auth.config.responseType, '')).to.match(/https:\/\/login\.microsoftonline\.com\/contoso\/oauth2\/authorize\?response_type=id_token%20token&client_id=the_client_id&redirect_uri=the_redirect_uri&state=the_state&client-request-id=the_correlation_id.*/);
    });

    it('verifies _getNavigateUrl() returns the correct value when scope is truthy and responseType is not truthy', () => {
      auth.config.url = 'https://login.microsoftonline.com/contoso/oauth2/';
      auth.config.scope = 'openid';
      auth.setResponseType('');
      auth.config.clientId = 'the_client_id';
      auth.config.redirectUri = 'the_redirect_uri';
      auth.config.state = 'the_state';
      auth.config.correlationId = 'the_correlation_id';
      expect(auth._getNavigateUrl(auth.config.responseType, '')).to.match(/https:\/\/login\.microsoftonline\.com\/contoso\/oauth2\/authorize\?response_type=id_token&client_id=the_client_id&redirect_uri=the_redirect_uri&state=the_state&client-request-id=the_correlation_id.*&scope=openid/);
    });

    it('verifies _getNavigateUrl() returns the correct value when scope and responseType are truthy', () => {
      auth.config.url = 'https://login.microsoftonline.com/contoso/oauth2/';
      auth.config.scope = 'openid';
      auth.setResponseType('id_token token');
      auth.config.clientId = 'the_client_id';
      auth.config.redirectUri = 'the_redirect_uri';
      auth.config.state = 'the_state';
      auth.config.correlationId = 'the_correlation_id';
      expect(auth._getNavigateUrl(auth.config.responseType, '')).to.match(/https:\/\/login\.microsoftonline\.com\/contoso\/oauth2\/authorize\?response_type=id_token%20token&client_id=the_client_id&redirect_uri=the_redirect_uri&state=the_state&client-request-id=the_correlation_id.*&scope=openid/);
    });
  });

  describe('function: _createUser', () => {
    it('verifies _createUser() returns null when an aud claim is not contained within the id_token', () => {
      const TOKEN = 'my-example-token';

      sandbox.stub(auth, '_extractIdToken').withArgs(TOKEN).returns({});

      const user = auth._createUser(TOKEN);

      expect(user).to.equal(null);
    });

    it('verifies _createUser() returns user object with userName matching the upn contained within the id_token when a single aud claim matching the clientId is present', () => {
      auth.config.clientId = 'e9a5a8b6-8af7-4719-9821-0deef255f68e';
      expect(auth._createUser(IDTOKEN_MOCK).userName).to.equal('user@oauthimplicit.ccsctp.net');
    });

    it('verifies _createUser() returns null when an unmatching single aud claim is contained within the id_token', () => {
      auth.config.clientId = 'not-a-match';
      expect(auth._createUser(IDTOKEN_MOCK)).to.equal(null);
    });

    it('verifies _createUser returns user object with userName matching the upn contained within the id_token when an aud claim array is present and a matching azp claim is present', () => {
      auth.config.clientId = 'e9a5a8b6-8af7-4719-9821-0deef255f68e';
      const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVUa0d0S1JrZ2FpZXpFWTJFc0xDMmdPTGpBNCJ9.eyJhdWQiOlsiZTlhNWE4YjYtOGFmNy00NzE5LTk4MjEtMGRlZWYyNTVmNjhlIl0sImF6cCI6ImU5YTVhOGI2LThhZjctNDcxOS05ODIxLTBkZWVmMjU1ZjY4ZSIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MtcHBlLm5ldC81MmQ0YjA3Mi05NDcwLTQ5ZmItODcyMS1iYzNhMWM5OTEyYTEvIiwiaWF0IjoxNDExOTU5MDAwLCJuYmYiOjE0MTE5NTkwMDAsImV4cCI6MTQxMTk2MjkwMCwidmVyIjoiMS4wIiwidGlkIjoiNTJkNGIwNzItOTQ3MC00OWZiLTg3MjEtYmMzYTFjOTkxMmExIiwiYW1yIjpbInB3ZCJdLCJvaWQiOiJmYTNjNWZhNy03ZDk4LTRmOTctYmZjNC1kYmQzYTRhMDI0MzEiLCJ1cG4iOiJ1c2VyQG9hdXRoaW1wbGljaXQuY2NzY3RwLm5ldCIsInVuaXF1ZV9uYW1lIjoidXNlckBvYXV0aGltcGxpY2l0LmNjc2N0cC5uZXQiLCJzdWIiOiJZN1RteEVjT0hTMjQ0YUdrdGNtamJyc2t2Tm1TUjhYejlfNmZtVzY1eWhnIiwiZmFtaWx5X25hbWUiOiJhIiwiZ2l2ZW5fbmFtZSI6InVzZXIiLCJub25jZSI6IjgwZmZhOTBhLWNiNzQtNGQwZi1hNGFjLWFlMWY5M2UzMmZlMCIsInB3ZF9leHAiOiI1Nzc5OTEwIiwicHdkX3VybCI6Imh0dHBzOi8vcG9ydGFsLm1pY3Jvc29mdG9ubGluZS5jb20vQ2hhbmdlUGFzc3dvcmQuYXNweCJ9.WHsl8TH1rQ3dQbRkV0TS6GBVAxzNOpG3nGG6mpEBCwAOCbyW6qRsSoo4qq8I5IGyerDf2cvcS-zzatHEROpRC9dcpwkRm6ta5dFZuouFyZ_QiYVKSMwfzEC_FI-6p7eT8gY6FbV51bp-Ah_WKJqEmaXv-lqjIpgsMGeWDgZRlB9cPODXosBq-PEk0q27Be-_A-KefQacJuWTX2eEhECLyuAu-ETVJb7s19jQrs_LJXz_ISib4DdTKPa7XTBDJlVGdCI18ctB67XwGmGi8MevkeKqFI8dkykTxeJ0MXMmEQbE6Fw-gxmP7uJYbZ61Jqwsw24zMDMeXatk2VWMBPCuhA';
      expect(auth._createUser(TOKEN).userName).to.equal('user@oauthimplicit.ccsctp.net');
    });

    it('verifies _createUser returns null when the id_token contains an matching aud claim within an aud claim array but without a matching azp claim', () => {
      auth.config.clientId = 'e9a5a8b6-8af7-4719-9821-0deef255f68e';
      const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVUa0d0S1JrZ2FpZXpFWTJFc0xDMmdPTGpBNCJ9.eyJhdWQiOlsiZTlhNWE4YjYtOGFmNy00NzE5LTk4MjEtMGRlZWYyNTVmNjhlIl0sImF6cCI6Im5vdC1hLW1hdGNoIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy1wcGUubmV0LzUyZDRiMDcyLTk0NzAtNDlmYi04NzIxLWJjM2ExYzk5MTJhMS8iLCJpYXQiOjE0MTE5NTkwMDAsIm5iZiI6MTQxMTk1OTAwMCwiZXhwIjoxNDExOTYyOTAwLCJ2ZXIiOiIxLjAiLCJ0aWQiOiI1MmQ0YjA3Mi05NDcwLTQ5ZmItODcyMS1iYzNhMWM5OTEyYTEiLCJhbXIiOlsicHdkIl0sIm9pZCI6ImZhM2M1ZmE3LTdkOTgtNGY5Ny1iZmM0LWRiZDNhNGEwMjQzMSIsInVwbiI6InVzZXJAb2F1dGhpbXBsaWNpdC5jY3NjdHAubmV0IiwidW5pcXVlX25hbWUiOiJ1c2VyQG9hdXRoaW1wbGljaXQuY2NzY3RwLm5ldCIsInN1YiI6Ilk3VG14RWNPSFMyNDRhR2t0Y21qYnJza3ZObVNSOFh6OV82Zm1XNjV5aGciLCJmYW1pbHlfbmFtZSI6ImEiLCJnaXZlbl9uYW1lIjoidXNlciIsIm5vbmNlIjoiODBmZmE5MGEtY2I3NC00ZDBmLWE0YWMtYWUxZjkzZTMyZmUwIiwicHdkX2V4cCI6IjU3Nzk5MTAiLCJwd2RfdXJsIjoiaHR0cHM6Ly9wb3J0YWwubWljcm9zb2Z0b25saW5lLmNvbS9DaGFuZ2VQYXNzd29yZC5hc3B4In0=.WHsl8TH1rQ3dQbRkV0TS6GBVAxzNOpG3nGG6mpEBCwAOCbyW6qRsSoo4qq8I5IGyerDf2cvcS-zzatHEROpRC9dcpwkRm6ta5dFZuouFyZ_QiYVKSMwfzEC_FI-6p7eT8gY6FbV51bp-Ah_WKJqEmaXv-lqjIpgsMGeWDgZRlB9cPODXosBq-PEk0q27Be-_A-KefQacJuWTX2eEhECLyuAu-ETVJb7s19jQrs_LJXz_ISib4DdTKPa7XTBDJlVGdCI18ctB67XwGmGi8MevkeKqFI8dkykTxeJ0MXMmEQbE6Fw-gxmP7uJYbZ61Jqwsw24zMDMeXatk2VWMBPCuhA';
      expect(auth._createUser(TOKEN)).to.equal(null);
    });

    it('verifies _createUser returns user object with userName matching the email claim contained within the id_token when no upn claim is present and a single aud claim matchint the clientId is present', () => {
      auth.config.clientId = 'e9a5a8b6-8af7-4719-9821-0deef255f68e';
      const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVUa0d0S1JrZ2FpZXpFWTJFc0xDMmdPTGpBNCJ9.eyJhdWQiOiJlOWE1YThiNi04YWY3LTQ3MTktOTgyMS0wZGVlZjI1NWY2OGUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLXBwZS5uZXQvNTJkNGIwNzItOTQ3MC00OWZiLTg3MjEtYmMzYTFjOTkxMmExLyIsImlhdCI6MTQxMTk1OTAwMCwibmJmIjoxNDExOTU5MDAwLCJleHAiOjE0MTE5NjI5MDAsInZlciI6IjEuMCIsInRpZCI6IjUyZDRiMDcyLTk0NzAtNDlmYi04NzIxLWJjM2ExYzk5MTJhMSIsImFtciI6WyJwd2QiXSwib2lkIjoiZmEzYzVmYTctN2Q5OC00Zjk3LWJmYzQtZGJkM2E0YTAyNDMxIiwiZW1haWwiOiJ1c2VyQG9hdXRoaW1wbGljaXQuY2NzY3RwLm5ldCIsInVuaXF1ZV9uYW1lIjoidXNlckBvYXV0aGltcGxpY2l0LmNjc2N0cC5uZXQiLCJzdWIiOiJZN1RteEVjT0hTMjQ0YUdrdGNtamJyc2t2Tm1TUjhYejlfNmZtVzY1eWhnIiwiZmFtaWx5X25hbWUiOiJhIiwiZ2l2ZW5fbmFtZSI6InVzZXIiLCJub25jZSI6IjgwZmZhOTBhLWNiNzQtNGQwZi1hNGFjLWFlMWY5M2UzMmZlMCIsInB3ZF9leHAiOiI1Nzc5OTEwIiwicHdkX3VybCI6Imh0dHBzOi8vcG9ydGFsLm1pY3Jvc29mdG9ubGluZS5jb20vQ2hhbmdlUGFzc3dvcmQuYXNweCJ9.WHsl8TH1rQ3dQbRkV0TS6GBVAxzNOpG3nGG6mpEBCwAOCbyW6qRsSoo4qq8I5IGyerDf2cvcS-zzatHEROpRC9dcpwkRm6ta5dFZuouFyZ_QiYVKSMwfzEC_FI-6p7eT8gY6FbV51bp-Ah_WKJqEmaXv-lqjIpgsMGeWDgZRlB9cPODXosBq-PEk0q27Be-_A-KefQacJuWTX2eEhECLyuAu-ETVJb7s19jQrs_LJXz_ISib4DdTKPa7XTBDJlVGdCI18ctB67XwGmGi8MevkeKqFI8dkykTxeJ0MXMmEQbE6Fw-gxmP7uJYbZ61Jqwsw24zMDMeXatk2VWMBPCuhA';
      expect(auth._createUser(TOKEN).userName).to.equal('user@oauthimplicit.ccsctp.net');
    });

    it('verifies _createUser returns user object with userName matching the sub claim contained within the id_token when no upn and no email claim are present and a single aud claim matchint the clientId is present', () => {
      auth.config.clientId = 'e9a5a8b6-8af7-4719-9821-0deef255f68e';
      const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVUa0d0S1JrZ2FpZXpFWTJFc0xDMmdPTGpBNCJ9.eyJhdWQiOiJlOWE1YThiNi04YWY3LTQ3MTktOTgyMS0wZGVlZjI1NWY2OGUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLXBwZS5uZXQvNTJkNGIwNzItOTQ3MC00OWZiLTg3MjEtYmMzYTFjOTkxMmExLyIsImlhdCI6MTQxMTk1OTAwMCwibmJmIjoxNDExOTU5MDAwLCJleHAiOjE0MTE5NjI5MDAsInZlciI6IjEuMCIsInRpZCI6IjUyZDRiMDcyLTk0NzAtNDlmYi04NzIxLWJjM2ExYzk5MTJhMSIsImFtciI6WyJwd2QiXSwib2lkIjoiZmEzYzVmYTctN2Q5OC00Zjk3LWJmYzQtZGJkM2E0YTAyNDMxIiwidW5pcXVlX25hbWUiOiJ1c2VyQG9hdXRoaW1wbGljaXQuY2NzY3RwLm5ldCIsInN1YiI6Ilk3VG14RWNPSFMyNDRhR2t0Y21qYnJza3ZObVNSOFh6OV82Zm1XNjV5aGciLCJmYW1pbHlfbmFtZSI6ImEiLCJnaXZlbl9uYW1lIjoidXNlciIsIm5vbmNlIjoiODBmZmE5MGEtY2I3NC00ZDBmLWE0YWMtYWUxZjkzZTMyZmUwIiwicHdkX2V4cCI6IjU3Nzk5MTAiLCJwd2RfdXJsIjoiaHR0cHM6Ly9wb3J0YWwubWljcm9zb2Z0b25saW5lLmNvbS9DaGFuZ2VQYXNzd29yZC5hc3B4In0=.WHsl8TH1rQ3dQbRkV0TS6GBVAxzNOpG3nGG6mpEBCwAOCbyW6qRsSoo4qq8I5IGyerDf2cvcS-zzatHEROpRC9dcpwkRm6ta5dFZuouFyZ_QiYVKSMwfzEC_FI-6p7eT8gY6FbV51bp-Ah_WKJqEmaXv-lqjIpgsMGeWDgZRlB9cPODXosBq-PEk0q27Be-_A-KefQacJuWTX2eEhECLyuAu-ETVJb7s19jQrs_LJXz_ISib4DdTKPa7XTBDJlVGdCI18ctB67XwGmGi8MevkeKqFI8dkykTxeJ0MXMmEQbE6Fw-gxmP7uJYbZ61Jqwsw24zMDMeXatk2VWMBPCuhA';
      expect(auth._createUser(TOKEN).userName).to.equal('Y7TmxEcOHS244aGktcmjbrskvNmSR8Xz9_6fmW65yhg');
    });
  });

  describe('function: _getParameters', () => {
    it('verifies that _getParameters returns an object containing the id_token when the fragment portion of the URL is blank and the search portion of the URL contains the id_token', () => {
      const TOKEN = 'eyJ4NXQiOiJObUptT0dVeE16WmxZak0yWkRSaE5UWmxZVEExWXpkaFpUUmlPV0UwTldJMk0ySm1PVGMxWkEiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImF1ZCI6WyJoUDdwa3JXYUJQa2NPTERaVmJsel9JZ2VtVmthIl0sImF6cCI6ImhQN3BrcldhQlBrY09MRFpWYmx6X0lnZW1Wa2EiLCJhdXRoX3RpbWUiOjE0NzU1MjI4MDksImlzcyI6Imh0dHBzOlwvXC9sb2NhbGhvc3Q6OTQ0M1wvb2F1dGgyXC90b2tlbiIsInNuIjoiV29vZHdhcmQiLCJnaXZlbl9uYW1lIjoiRGF2aWQiLCJleHAiOjE0NzU1MjMxMDksIm5vbmNlIjoiNWE3MWM5ZmYtYjI1YS00YzE1LWEzNjgtNzdmODgwZWRkOWI2IiwiaWF0IjoxNDc1NTIyODA5fQ.B5KAglX92PPppP66yMkyzD1LA7qdWhrQWqYEOzJ0uFB_ZN8_u7G7Pp0qBy0Uilbh6AS0go64pzX5sxU72psHr6z2xVMJYm8-zjTb1GDVP3thUlZ1nEK-esUjSBLDnN1qKmMINtX82S3KIpAlehB1nZ94kbOHCoZ9v_k1rnTiWRA';
      const search = '?id_token=' + TOKEN + '&state=6777d1e8-6014-403d-ac0c-297dec5cc514';
      expect(auth._getParameters(undefined, search).id_token).to.equal(TOKEN);
    });

    it('verifies that _getParameters returns an object containing the id_token when the fragment porion of the URL contains the access_token and the search portion of the URL is blank', () => {
      const TOKEN = '4dce1d4c-3828-3873-bdda-9b2ba2726ac4';
      const hash = '#/access_token=' + TOKEN + '&state=1120063b-8c7b-4fac-a121-a0e7e4ccb270&token_type=Bearer&expires_in=197&session_state=a41ac575b3d4c1b50acee40499a7efc1d46485913bd8520b13eebec6a657da3e.Vxrih14RiYpyTIs-X21-Pg';
      expect(auth._getParameters(hash, undefined).access_token).to.equal(TOKEN);
    });

    it('verifies that _getParameters returns an object containing the id_token when the fragment portion of the URL contains the id_token and the search portion of the URL is blank.', () => {
      const hash = '#/' + VALID_URLFRAGMENT;
      expect(auth._getParameters(hash, undefined).id_token).to.equal(IDTOKEN_MOCK);
    });

    it('verifies that _getParameters returns an object containing both the access_token and the id_token when the fragment poriton of the URL contains both the id_token and the access_token and the search portion of the URL is blank.', () => {
      const ID_TOKEN = 'eyJ4NXQiOiJObUptT0dVeE16WmxZak0yWkRSaE5UWmxZVEExWXpkaFpUUmlPV0UwTldJMk0ySm1PVGMxWkEiLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiQUI4Si1WaHlvbWxseTJBbktvN2dVUSIsInN1YiI6ImFkbWluIiwiYXVkIjpbImhQN3BrcldhQlBrY09MRFpWYmx6X0lnZW1Wa2EiXSwiYXpwIjoiaFA3cGtyV2FCUGtjT0xEWlZibHpfSWdlbVZrYSIsImF1dGhfdGltZSI6MTQ3NTUyMjUyMCwiaXNzIjoiaHR0cHM6XC9cL2xvY2FsaG9zdDo5NDQzXC9vYXV0aDJcL3Rva2VuIiwic24iOiJXb29kd2FyZCIsImdpdmVuX25hbWUiOiJEYXZpZCIsImV4cCI6MTQ3NTUyMjgyMCwibm9uY2UiOiI1NTRkMjE5Ny0yYTQzLTQzMGUtOGJmNy1kMjk5MTIxNjE5MDEiLCJpYXQiOjE0NzU1MjI1MjB9.WrTgmLsBuP6BG1v1aBs4dp3ONYEtuzlUySsG4ImpAVIBg9BJv_nc9NPDSK_IMxiKi7sHwJWzCzNLHUbOkmmZxTqIQt7KEs_Kx2ZBlf_Yvb_YPyAcUasBlX4BzHLq0nOAqax43fgholLLXPA4WZmBkDVw6piquPQ45uCJ8_Myezs';
      const ACCESS_TOKEN = 'eda1a60f-4dbd-3b8c-bfce-60d3980040a5';
      const hash = '#/access_token=' + ACCESS_TOKEN + '&id_token=' + ID_TOKEN + '&state=e60a53f8-fadc-477a-b51d-64e7c31b06e9&token_type=Bearer&expires_in=300&session_state=8cbc061a22547adff4c5f88a80de8999129997b8ff7c7c66c870a43d6d2a2d6a.enxHcp7nDHTPhFPWaY-l4g';
      const parameters = auth._getParameters(hash, undefined);
      expect(parameters.id_token).to.equal(ID_TOKEN);
      expect(parameters.access_token).to.equal(ACCESS_TOKEN);
    });
  });
});
