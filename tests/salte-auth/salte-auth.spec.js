import { expect } from 'chai';
import uuid from 'uuid';

import { SalteAuth } from '../../src/salte-auth.js';

describe('salte-auth', () => {
  let sandbox, auth;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(uuid, 'v4').returns('33333333-3333-4333-b333-333333333333');
    sandbox.stub(window, 'setTimeout');

    auth = new SalteAuth({
      provider: 'auth0'
    });
  });

  afterEach(() => {
    auth.utilities.interceptors = {
      fetch: [],
      xhr: []
    };
    auth.profile.clear();
    delete window.salte.SalteAuthProfile.$instance;
    delete window.salte.auth;
    sandbox.restore();
  });

  describe('function(constructor)', () => {
    it('should be a singleton', () => {
      auth.bogus = 'test';
      expect(auth.bogus).to.equal('test');
      expect(new SalteAuth().bogus).to.equal('test');
    });

    it('should allow passing an empty config', () => {
      delete window.salte.SalteAuthProfile.$instance;
      delete window.salte.auth;

      auth = new SalteAuth();

      expect(auth.$config).to.deep.equal({
        storageType: 'session'
      });
      expect(auth.$config).to.deep.equal(auth.profile.$$config);
    });

    it('should default storageType to "session"', () => {
      delete window.salte.SalteAuthProfile.$instance;
      delete window.salte.auth;

      auth = new SalteAuth({
        test: 'test'
      });

      expect(auth.$config).to.deep.equal({
        test: 'test',
        storageType: 'session'
      });
      expect(auth.$config).to.deep.equal(auth.profile.$$config);
    });

    it('should support overriding the storageType', () => {
      delete window.salte.SalteAuthProfile.$instance;
      delete window.salte.auth;

      auth = new SalteAuth({
        test: 'test',
        storageType: 'local'
      });

      expect(auth.$config).to.deep.equal({
        test: 'test',
        storageType: 'local'
      });
      expect(auth.$config).to.deep.equal(auth.profile.$$config);
    });

    it('should recreate the path to the instance', () => {
      auth.bogus = 'test';
      expect(auth.bogus).to.equal('test');

      delete window.salte.SalteAuthProfile.$instance;
      delete window.salte.auth;

      auth = new SalteAuth();

      expect(auth.bogus).to.be.undefined;
      expect(window.salte.auth).to.be.instanceof(SalteAuth);
    });

    it('should destroy the authentication iframe', () => {
      const iframe = document.createElement('iframe');
      parent.document.body.appendChild(iframe);
      iframe.setAttribute('owner', 'salte-auth');

      delete window.salte.SalteAuthProfile.$instance;
      delete window.salte.auth;

      auth = new SalteAuth();

      expect(parent.document.querySelector('[owner="salte-auth"]')).to.equal(null);
    });

    it('should close the popup window', () => {
      const popup = {
        close: sandbox.stub()
      };
      sandbox.stub(auth.utilities, 'popup').get(() => popup);

      delete window.salte.SalteAuthProfile.$instance;
      delete window.salte.auth;

      auth = new SalteAuth({
        storageType: 'local'
      });

      expect(popup.close.callCount).to.equal(0);
      setTimeout(() => {
        expect(popup.close.callCount).to.equal(1);
      });
    });

    it('should transfer the storage if we are using "sessionStorage"', () => {
      const popup = {
        close: sandbox.stub()
      };
      sandbox.stub(auth.utilities, 'popup').get(() => popup);

      delete window.salte.SalteAuthProfile.$instance;
      delete window.salte.auth;

      auth = new SalteAuth();

      expect(popup.close.callCount).to.equal(0);
      setTimeout(() => {
        expect(popup.close.callCount).to.equal(1);
      });
    });

    it('should redirect to the "redirectUrl"', () => {
      const url = `${location.href}?test=test`;
      sandbox.stub(auth.profile, 'redirectUrl')
        .get(() => url)
        .set((redirectUrl) => {
          expect(redirectUrl).to.equal(undefined);
        });

      delete window.salte.auth;

      auth = new SalteAuth();

      expect(location.href).to.equal(url);
    });
  });

  describe('interceptor(fetch)', () => {
    it('should request a new access token if we are not authenticated', () => {
      sandbox.stub(auth, 'retrieveAccessToken').returns(Promise.resolve('55555-55555'));
      auth.$config = {
        endpoints: [
          `${location.protocol}//${location.host}`
        ]
      };

      auth.utilities.addFetchInterceptor((input, options) => {
        return Promise.resolve().then(() => {
          expect(options.headers.Authorization).to.equal('Bearer 55555-55555');
        });
      });

      return fetch('/');
    });

    it('should not request a new access token if we do not need to be authenticated', () => {
      auth.utilities.addFetchInterceptor((input, options) => {
        return Promise.resolve().then(() => {
          expect(options.headers).to.be.undefined;
        });
      });

      return fetch('/');
    });
  });

  describe('interceptor(xhr)', () => {
    it('should request a new access token if we are not authenticated', (done) => {
      sandbox.stub(auth, 'retrieveAccessToken').returns(Promise.resolve('55555-55555'));
      const setRequestHeaderSpy = sandbox.spy(XMLHttpRequest.prototype, 'setRequestHeader');
      auth.$config = {
        endpoints: [
          `${location.protocol}//${location.host}`
        ]
      };

      expect(setRequestHeaderSpy.callCount).to.equal(0);

      const request = new XMLHttpRequest();
      request.addEventListener('load', () => {
        expect(setRequestHeaderSpy.callCount).to.equal(1);
        expect(setRequestHeaderSpy.firstCall.args).to.deep.equal([
          'Authorization',
          'Bearer 55555-55555'
        ]);
        done();
      });

      request.open('GET', '/');
      request.send();
    });

    it('should request a new access token if we are not authenticated', (done) => {
      sandbox.stub(auth, 'retrieveAccessToken').returns(Promise.resolve('55555-55555'));
      const setRequestHeaderSpy = sandbox.spy(XMLHttpRequest.prototype, 'setRequestHeader');

      expect(setRequestHeaderSpy.callCount).to.equal(0);

      const request = new XMLHttpRequest();
      request.addEventListener('load', () => {
        expect(setRequestHeaderSpy.callCount).to.equal(0);
        done();
      });

      request.open('GET', '/');
      request.send();
    });
  });

  describe('getter(provider)', () => {
    it('should return a provider', () => {
      auth.$config.provider = 'auth0';
      expect(auth.provider).to.not.be.undefined;
    });

    it('should support custom providers', () => {
      auth.$config.provider = class {};
      expect(auth.provider).to.equal(auth.$config.provider);
    });

    it('should throw an error if the provider is unsupported', () => {
      auth.$config.provider = 'azure';
      expect(() => auth.provider).to.throw('Unknown Provider (azure)');
    });

    it('should throw an error if the provider was not specified', () => {
      auth.$config.provider = null;
      expect(() => auth.provider).to.throw('A provider must be specified');
    });
  });

  // TODO: Make this more thorough by including more config params
  describe('getter(accessTokenUrl)', () => {
    it('should compute the accessTokenUrl', () => {
      salte.auth.$config = {
        gateway: 'https://api.salte.io',
        redirectUrl: `${location.protocol}//${location.host}`,
        clientId: 'clPAMX8O88JBusd9u09DsmwQZrKor5ay',
        scope: 'openid',
        provider: 'auth0'
      };
      expect(auth.accessTokenUrl).to.equal(`https://api.salte.io/authorize?state=33333333-3333-4333-b333-333333333333&nonce=33333333-3333-4333-b333-333333333333&response_type=token&redirect_uri=${encodeURIComponent(`${location.protocol}//${location.host}`)}&client_id=clPAMX8O88JBusd9u09DsmwQZrKor5ay&scope=openid&prompt=none`);
    });

    it('should utilize authorizeUrl overrides', () => {
      salte.auth.$config = {
        gateway: 'https://mydomain.auth.us-east-1.amazoncognito.com',
        redirectUrl: `${location.protocol}//${location.host}`,
        clientId: 'clPAMX8O88JBusd9u09DsmwQZrKor5ay',
        scope: 'openid',
        provider: 'cognito'
      };
      expect(auth.accessTokenUrl).to.equal(`https://mydomain.auth.us-east-1.amazoncognito.com/oauth2/authorize?state=33333333-3333-4333-b333-333333333333&nonce=33333333-3333-4333-b333-333333333333&response_type=token&redirect_uri=${encodeURIComponent(`${location.protocol}//${location.host}`)}&client_id=clPAMX8O88JBusd9u09DsmwQZrKor5ay&scope=openid&prompt=none`);
    });
  });

  describe('getter(authorizeUrl)', () => {
    it('should compute the authorizeUrl', () => {
      salte.auth.$config = {
        gateway: 'https://api.salte.io',
        responseType: 'id_token',
        redirectUrl: `${location.protocol}//${location.host}`,
        clientId: 'clPAMX8O88JBusd9u09DsmwQZrKor5ay',
        scope: 'openid',
        provider: 'auth0'
      };
      expect(auth.authorizeUrl).to.equal(`https://api.salte.io/authorize?state=33333333-3333-4333-b333-333333333333&nonce=33333333-3333-4333-b333-333333333333&response_type=id_token&redirect_uri=${encodeURIComponent(`${location.protocol}//${location.host}`)}&client_id=clPAMX8O88JBusd9u09DsmwQZrKor5ay&scope=openid`);
    });

    it('should utilize authorizeUrl overrides', () => {
      salte.auth.$config = {
        gateway: 'https://mydomain.auth.us-east-1.amazoncognito.com',
        responseType: 'id_token',
        redirectUrl: `${location.protocol}//${location.host}`,
        clientId: 'clPAMX8O88JBusd9u09DsmwQZrKor5ay',
        scope: 'openid',
        provider: 'cognito'
      };
      expect(salte.auth.authorizeUrl).to.equal(`https://mydomain.auth.us-east-1.amazoncognito.com/oauth2/authorize?state=33333333-3333-4333-b333-333333333333&nonce=33333333-3333-4333-b333-333333333333&response_type=id_token&redirect_uri=${encodeURIComponent(`${location.protocol}//${location.host}`)}&client_id=clPAMX8O88JBusd9u09DsmwQZrKor5ay&scope=openid`);
    });
  });

  describe('getter(deauthorizeUrl)', () => {
    it('should compute the deauthorizeUrl', (done) => {
      salte.auth.$config = {
        gateway: 'https://api.salte.io',
        responseType: 'id_token',
        redirectUrl: `${location.protocol}//${location.host}`,
        clientId: 'clPAMX8O88JBusd9u09DsmwQZrKor5ay',
        scope: 'openid',

        provider: 'auth0'
      };
      sandbox.stub(auth.provider, 'deauthorizeUrl').callsFake(function(config) {
        expect(this).to.be.an.instanceof(SalteAuth);
        expect(config).to.deep.equal(salte.auth.$config);
        done();
      });
      auth.deauthorizeUrl;
    });
  });

  describe('function(signInWithIframe)', () => {
    beforeEach(() => {
      auth.profile.clear();
      sandbox.stub(auth.profile, 'clear');
      sandbox.stub(auth.utilities, 'createIframe').returns(Promise.resolve());
      salte.auth.$config = {
        gateway: `${location.protocol}//${location.host}`,
        provider: 'auth0'
      };
    });

    it('should resolve when we have signed in', () => {
      sandbox.stub(auth.profile, 'validate');

      const promise = auth.signInWithIframe();

      expect(auth.profile.clear.callCount).to.equal(1);
      expect(auth.$promises.login).to.equal(promise);
      return promise.then(() => {
        expect(auth.$promises.login).to.equal(null);
      });
    });

    it('should prevent duplicate promises', () => {
      sandbox.stub(auth.profile, 'validate');

      const promise = auth.signInWithIframe();
      const duplicatePromise = auth.signInWithIframe();

      expect(promise).to.equal(duplicatePromise);

      return promise;
    });

    it('should throw validation errors', () => {
      auth.profile.idToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsIm5vbmNlIjpudWxsfQ.MsykD5osfoXwKRr7IFz8XHgSkgIQTDHEtX432LS-QJc';

      const promise = auth.signInWithIframe();

      return promise.catch((error) => {
        return error;
      }).then((error) => {
        expect(error).to.deep.equal({
          code: 'invalid_nonce',
          description: 'Nonce provided by gateway did not match local nonce.'
        });
      });
    });
  });

  describe('function(signInWithPopup)', () => {
    it('should resolve when we have signed in', () => {
      sandbox.stub(auth.profile, 'clear');
      sandbox.stub(auth, 'authorizeUrl').get(() => '');
      sandbox.stub(auth.utilities, 'openPopup').returns(Promise.resolve());
      sandbox.stub(auth.profile, 'validate');
      sandbox.stub(auth.profile, '$$transfer');

      const promise = auth.signInWithPopup();

      expect(auth.profile.clear.callCount).to.equal(1);
      expect(auth.$promises.login).to.equal(promise);
      expect(auth.profile.$$transfer.callCount).to.equal(0);
      return promise.then(() => {
        expect(auth.profile.$$transfer.callCount).to.equal(1);
        expect(auth.$promises.login).to.equal(null);
      });
    });

    it('should bypass transfering storage when using "localStorage"', () => {
      sandbox.stub(auth.profile, 'clear');
      sandbox.stub(auth, 'authorizeUrl').get(() => '');
      sandbox.stub(auth.utilities, 'openPopup').returns(Promise.resolve());
      sandbox.stub(auth.profile, 'validate');
      sandbox.stub(auth.profile, '$$transfer');

      auth.$config.storageType = 'local';

      const promise = auth.signInWithPopup();

      expect(auth.profile.clear.callCount).to.equal(1);
      expect(auth.$promises.login).to.equal(promise);
      return promise.then(() => {
        expect(auth.profile.$$transfer.callCount).to.equal(0);
        expect(auth.$promises.login).to.equal(null);
      });
    });

    it('should prevent duplicate promises', () => {
      sandbox.stub(auth.profile, 'clear');
      sandbox.stub(auth, 'authorizeUrl').get(() => '');
      sandbox.stub(auth.utilities, 'openPopup').returns(Promise.resolve());
      sandbox.stub(auth.profile, 'validate');

      const promise = auth.signInWithPopup();
      const duplicatePromise = auth.signInWithPopup();

      expect(promise).to.equal(duplicatePromise);

      return promise;
    });

    it('should throw validation errors', () => {
      sandbox.stub(auth.profile, 'clear');
      sandbox.stub(auth, 'authorizeUrl').get(() => '');
      sandbox.stub(auth.utilities, 'openPopup').returns(Promise.resolve());

      auth.profile.idToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsIm5vbmNlIjpudWxsfQ.MsykD5osfoXwKRr7IFz8XHgSkgIQTDHEtX432LS-QJc';

      const promise = auth.signInWithPopup();

      return promise.catch((error) => {
        return error;
      }).then((error) => {
        expect(error).to.deep.equal({
          code: 'invalid_nonce',
          description: 'Nonce provided by gateway did not match local nonce.'
        });
      });
    });
  });

  describe('function(signInWithRedirect)', () => {
    it('should resolve when we have signed in', () => {
      sandbox.stub(auth.profile, 'clear');
      sandbox.stub(auth, 'authorizeUrl').get(() => location.href);

      auth.signInWithRedirect();

      expect(auth.profile.clear.callCount).to.equal(1);
      expect(auth.profile.redirectUrl).to.equal(location.href);
      expect(auth.$promises.logout).to.be.undefined;
    });
  });

  describe('function(signOutWithIframe)', () => {
    it('should resolve when we have signed in', () => {
      sandbox.stub(auth.profile, 'clear');
      sandbox.stub(auth, 'deauthorizeUrl').get(() => '');
      sandbox.stub(auth.utilities, 'createIframe').returns(Promise.resolve());

      const promise = auth.signOutWithIframe();

      expect(auth.profile.clear.callCount).to.equal(1);
      expect(auth.$promises.logout).to.equal(promise);
      return promise.then(() => {
        expect(auth.$promises.logout).to.equal(null);
      });
    });

    it('should prevent duplicate promises', () => {
      sandbox.stub(auth.profile, 'clear');
      sandbox.stub(auth, 'deauthorizeUrl').get(() => '');
      sandbox.stub(auth.utilities, 'createIframe').returns(Promise.resolve());

      const promise = auth.signOutWithIframe();
      const duplicatePromise = auth.signOutWithIframe();

      expect(promise).to.equal(duplicatePromise);

      return promise;
    });
  });

  describe('function(signOutWithPopup)', () => {
    it('should resolve when we have signed in', () => {
      sandbox.stub(auth.profile, 'clear');
      sandbox.stub(auth, 'deauthorizeUrl').get(() => '');
      sandbox.stub(auth.utilities, 'openPopup').returns(Promise.resolve());

      const promise = auth.signOutWithPopup();

      expect(auth.profile.clear.callCount).to.equal(1);
      expect(auth.$promises.logout).to.equal(promise);
      return promise.then(() => {
        expect(auth.$promises.logout).to.equal(null);
      });
    });

    it('should prevent duplicate promises', () => {
      sandbox.stub(auth.profile, 'clear');
      sandbox.stub(auth, 'deauthorizeUrl').get(() => '');
      sandbox.stub(auth.utilities, 'openPopup').returns(Promise.resolve());
      sandbox.stub(auth.profile, 'validate');

      const promise = auth.signOutWithPopup();
      const duplicatePromise = auth.signOutWithPopup();

      expect(promise).to.equal(duplicatePromise);

      return promise;
    });
  });

  describe('function(signOutWithRedirect)', () => {
    it('should resolve when we have signed in', () => {
      sandbox.stub(auth.profile, 'clear');
      sandbox.stub(auth, 'deauthorizeUrl').get(() => location.href);

      auth.signOutWithRedirect();

      expect(auth.profile.clear.callCount).to.equal(1);
      expect(auth.$promises.logout).to.be.undefined;
    });
  });

  describe('function(retrieveAccessToken)', () => {
    it('should default to using an iframe for auto logging in', () => {
      sandbox.stub(auth, 'signInWithIframe').returns(Promise.resolve());
      sandbox.stub(auth.profile, 'idTokenExpired').get(() => true);
      sandbox.stub(auth.profile, 'accessTokenExpired').get(() => true);
      sandbox.stub(auth.profile, 'clearErrors');
      sandbox.stub(auth.profile, 'validate');
      sandbox.stub(auth.utilities, 'createIframe').returns(Promise.resolve());

      const promise = auth.retrieveAccessToken();

      auth.profile.accessToken = '55555-55555';

      expect(auth.$promises.token).to.equal(promise);
      return promise.then((accessToken) => {
        expect(auth.signInWithIframe.callCount).to.equal(1);
        expect(auth.profile.clearErrors.callCount).to.equal(1);
        expect(accessToken).to.equal('55555-55555');
        expect(auth.$promises.token).to.equal(null);
      });
    });

    it('should support using a popup to auto login', () => {
      auth.$config = {
        loginType: 'popup',
        provider: 'auth0'
      };
      sandbox.stub(auth, 'signInWithPopup').returns(Promise.resolve());
      sandbox.stub(auth.profile, 'idTokenExpired').get(() => true);
      sandbox.stub(auth.profile, 'accessTokenExpired').get(() => true);
      sandbox.stub(auth.profile, 'clearErrors');
      sandbox.stub(auth.profile, 'validate');
      sandbox.stub(auth.utilities, 'createIframe').returns(Promise.resolve());

      const promise = auth.retrieveAccessToken();

      auth.profile.accessToken = '55555-55555';

      expect(auth.$promises.token).to.equal(promise);
      return promise.then((accessToken) => {
        expect(auth.signInWithPopup.callCount).to.equal(1);
        expect(auth.profile.clearErrors.callCount).to.equal(1);
        expect(accessToken).to.equal('55555-55555');
        expect(auth.$promises.token).to.equal(null);
      });
    });

    it('should bypass fetching the tokens if they have not expired', () => {
      sandbox.stub(auth.profile, 'idTokenExpired').get(() => false);
      sandbox.stub(auth.profile, 'accessTokenExpired').get(() => false);
      sandbox.stub(auth.profile, 'clearErrors');

      const promise = auth.retrieveAccessToken();

      auth.profile.accessToken = '55555-55555';

      expect(auth.$promises.token).to.equal(promise);
      return promise.then((accessToken) => {
        expect(auth.profile.clearErrors.callCount).to.equal(1);
        expect(accessToken).to.equal('55555-55555');
        expect(auth.$promises.token).to.equal(null);
      });
    });

    it('should not allow auto logging in via "redirect"', () => {
      auth.$config = {
        loginType: 'redirect'
      };
      sandbox.stub(auth.profile, 'idTokenExpired').get(() => true);

      const promise = auth.retrieveAccessToken();

      expect(auth.$promises.token).to.equal(null);
      return promise.catch((error) => {
        return error;
      }).then((error) => {
        expect(error.message).to.equal('Invaid Login Type (redirect)');
        expect(auth.$promises.token).to.equal(null);
      });
    });

    it('should prevent duplicate promises', () => {
      sandbox.stub(auth, 'signInWithIframe').returns(Promise.resolve());
      sandbox.stub(auth.profile, 'idTokenExpired').get(() => true);
      sandbox.stub(auth.profile, 'accessTokenExpired').get(() => true);
      sandbox.stub(auth.profile, 'clearErrors');
      sandbox.stub(auth.profile, 'validate');
      sandbox.stub(auth.utilities, 'createIframe').returns(Promise.resolve());

      const promise = auth.retrieveAccessToken();
      const duplicatePromise = auth.retrieveAccessToken();

      auth.profile.accessToken = '55555-55555';

      expect(promise).to.equal(duplicatePromise);
      return promise;
    });

    it('should throw validation errors', () => {
      sandbox.stub(auth.profile, 'idTokenExpired').get(() => false);
      sandbox.stub(auth.profile, 'accessTokenExpired').get(() => true);
      sandbox.stub(auth.profile, 'clearErrors');
      sandbox.stub(auth.utilities, 'createIframe').returns(Promise.resolve());

      auth.profile.accessToken = '55555-55555';

      const promise = auth.retrieveAccessToken();

      return promise.catch((error) => {
        return error;
      }).then((error) => {
        expect(error).to.deep.equal({
          code: 'invalid_state',
          description: 'State provided by gateway did not match local state.'
        });
      });
    });
  });

  describe('function($$onRouteChanged)', () => {
    it('should authenticate if the route is secure', () => {
      sandbox.stub(auth, 'retrieveAccessToken').returns(Promise.resolve());
      auth.$config = {
        routes: true
      };

      expect(auth.retrieveAccessToken.callCount).to.equal(0);

      auth.$$onRouteChanged();

      expect(auth.retrieveAccessToken.callCount).to.equal(1);
    });

    it('should not authenticate if the route is not secure', () => {
      sandbox.stub(auth, 'retrieveAccessToken').returns(Promise.resolve());
      auth.$config = {
        routes: false
      };

      expect(auth.retrieveAccessToken.callCount).to.equal(0);

      auth.$$onRouteChanged();

      expect(auth.retrieveAccessToken.callCount).to.equal(0);
    });
  });
});
