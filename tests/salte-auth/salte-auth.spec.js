import { expect } from 'chai';
import uuid from 'uuid';

import SalteAuth from '../../src/salte-auth.js';
import SalteAuthUtilities from '../../src/salte-auth.utilities.js';
import SalteAuthProfile from '../../src/salte-auth.profile.js';

describe('salte-auth', () => {
  let auth;

  beforeEach(() => {
    sinon.stub(uuid, 'v4').returns('33333333-3333-4333-b333-333333333333');
    sinon.stub(window, 'setTimeout').returns(true);
    sinon.stub(window, 'clearTimeout');
    // NOTE: Stubbing console so we don't get spammed.
    sinon.stub(console, 'warn');
    sinon.stub(console, 'error');
    // NOTE: We're just stubbing these so we can restore it later!
    sinon.stub(window, 'fetch').callThrough();
    sinon.stub(XMLHttpRequest.prototype, 'open').callThrough();
    sinon.stub(XMLHttpRequest.prototype, 'send').callThrough();
    // NOTE: These are functions we never want to call
    sinon.stub(SalteAuthUtilities.prototype, '$navigate');
    sinon.stub(SalteAuthProfile.prototype, '$idToken').get(() => {
      return `12345.${btoa(JSON.stringify({
        sub: '1234567890',
        name: 'John Doe',
        exp: 1524168810
      }))}.12345`;
    });
    auth = new SalteAuth({
      provider: 'auth0'
    });
  });

  afterEach(() => {
    auth.profile.$clear();
    delete window.salte.auth;
    sinon.restore();
  });

  describe('function(constructor)', () => {
    it('should be a singleton', () => {
      auth.bogus = 'test';
      expect(auth.bogus).to.equal('test');
      expect(new SalteAuth().bogus).to.equal('test');
    });

    it('should not allow passing an empty config', () => {
      delete window.salte.auth;

      expect(() => new SalteAuth()).to.throw(ReferenceError);
      expect(window.salte.auth).to.be.undefined;
    });

    it('should fire off a create event', () => {
      const promise = new Promise((resolve, reject) => {
        window.addEventListener('salte-auth-create', (event) => {
          if (event.detail.error) return reject(event.detail.error);

          return resolve(event.detail.data);
        });
      });

      delete window.salte.auth;

      auth = new SalteAuth({
        provider: 'auth0'
      });

      return promise.then((instance) => {
        expect(instance).to.equal(auth);
      });
    });

    it('should default loginType, autoRefresh, storageType, validation and autoRefreshBuffer', () => {
      delete window.salte.auth;

      auth = new SalteAuth({
        provider: 'auth0'
      });

      expect(auth.$config).to.deep.equal({
        loginType: 'iframe',
        autoRefresh: true,
        provider: 'auth0',
        storageType: 'session',
        autoRefreshBuffer: 60000,
        validation: {
          aud: true,
          azp: true,
          nonce: true,
          state: true
        }
      });
      expect(auth.$config).to.deep.equal(auth.profile.$$config);
    });

    it('should support overriding the loginType, autoRefresh, storageType, validation and autoRefreshBuffer', () => {
      delete window.salte.auth;

      auth = new SalteAuth({
        loginType: 'redirect',
        autoRefresh: false,
        provider: 'auth0',
        autoRefreshBuffer: 500,
        storageType: 'local',
        validation: {
          nonce: false
        }
      });

      expect(auth.$config).to.deep.equal({
        loginType: 'redirect',
        autoRefresh: false,
        provider: 'auth0',
        storageType: 'local',
        autoRefreshBuffer: 500,
        validation: {
          aud: true,
          azp: true,
          nonce: false,
          state: true
        }
      });
      expect(auth.$config).to.deep.equal(auth.profile.$$config);
    });

    it('should recreate the path to the instance', () => {
      auth.bogus = 'test';
      expect(auth.bogus).to.equal('test');

      delete window.salte.auth;

      auth = new SalteAuth({
        provider: 'auth0'
      });

      expect(auth.bogus).to.be.undefined;
      expect(window.salte.auth).to.be.instanceof(SalteAuth);
    });

    it('should destroy the authentication iframe', () => {
      const iframe = document.createElement('iframe');
      parent.document.body.appendChild(iframe);
      iframe.setAttribute('owner', 'salte-auth');

      delete window.salte.auth;

      auth = new SalteAuth({
        provider: 'auth0'
      });

      expect(parent.document.querySelector('[owner="salte-auth"]')).to.equal(
        null
      );
    });

    it('should close the popup window', () => {
      const popup = {
        close: sinon.stub()
      };
      sinon.stub(SalteAuthUtilities.prototype, '$popup').get(() => popup);

      delete window.salte.auth;

      auth = new SalteAuth({
        storageType: 'local',
        provider: 'auth0'
      });

      expect(popup.close.callCount).to.equal(0);
      setTimeout(() => {
        expect(popup.close.callCount).to.equal(1);
      });
    });

    it('should transfer the storage if we are using "sessionStorage"', () => {
      const popup = {
        close: sinon.stub()
      };
      sinon.stub(SalteAuthUtilities.prototype, '$popup').get(() => popup);

      delete window.salte.auth;

      auth = new SalteAuth({
        provider: 'auth0'
      });

      expect(popup.close.callCount).to.equal(0);
      setTimeout(() => {
        expect(popup.close.callCount).to.equal(1);
      });
    });

    it('should redirect to the "redirectUrl"', done => {
      const url = `${location.protocol}//${location.host}${
        location.pathname
      }#test=test`;
      sinon.stub(SalteAuthProfile.prototype, '$validate').returns(undefined);
      sinon
        .stub(SalteAuthProfile.prototype, '$redirectUrl')
        .get(() => url)
        .set(redirectUrl => {
          expect(redirectUrl).to.equal(undefined);
        });

      delete window.salte.auth;

      auth = new SalteAuth({
        provider: 'auth0',
        redirectLoginCallback: error => {
          expect(error).to.deep.equal(undefined);
          done();
        }
      });

      expect(location.href).to.equal(url);
    });

    it('should fire off a "login" event if we failed to login via a redirect', () => {
      window.setTimeout.restore();

      sinon.stub(SalteAuthProfile.prototype, '$validate').returns({
        code: 'stuff_broke',
        description: 'what did you break!'
      });
      sinon.stub(SalteAuthProfile.prototype, '$redirectUrl').get(() => 'error');
      sinon.stub(SalteAuthProfile.prototype, '$state').get(() => 'bogus');

      delete window.salte.auth;

      auth = new SalteAuth({
        provider: 'auth0'
      });

      auth.profile.$actions('bogus', 'login');

      return new Promise((resolve, reject) => {
        auth.on('login', (error) => {
          if (error) return resolve(error);

          return reject('Promise unexpectedly resolved');
        });
      }).then((error) => {
        expect(error).to.deep.equal({
          code: 'stuff_broke',
          description: 'what did you break!'
        });
      });
    });

    it('should fire off a "logout" event if we failed to logout via a redirect', () => {
      window.setTimeout.restore();

      sinon.stub(SalteAuthProfile.prototype, '$validate').returns({
        code: 'stuff_broke',
        description: 'what did you break!'
      });
      sinon.stub(SalteAuthProfile.prototype, '$redirectUrl').get(() => 'error');
      sinon.stub(SalteAuthProfile.prototype, '$state').get(() => 'bogus');

      delete window.salte.auth;

      auth = new SalteAuth({
        provider: 'auth0'
      });

      auth.profile.$actions('bogus', 'logout');

      return new Promise((resolve, reject) => {
        auth.on('logout', (error) => {
          if (error) return resolve(error);

          return reject('Promise unexpectedly resolved');
        });
      }).then((error) => {
        expect(error).to.deep.equal({
          code: 'stuff_broke',
          description: 'what did you break!'
        });
      });
    });

    it('should do nothing if the action is unknown', () => {
      window.setTimeout.restore();

      sinon.stub(SalteAuthProfile.prototype, '$validate').returns({
        code: 'stuff_broke',
        description: 'what did you break!'
      });
      sinon.stub(SalteAuthProfile.prototype, '$redirectUrl').get(() => 'error');
      sinon.stub(SalteAuthProfile.prototype, '$state').get(() => 'bogus');
      sinon.stub(SalteAuth.prototype, 'on');

      delete window.salte.auth;

      auth = new SalteAuth({
        provider: 'auth0'
      });

      auth.profile.$actions('bogus', 'bogus');

      expect(auth.on.callCount).to.equal(3);
    });

    it('should validate for errors when redirecting', done => {
      sinon.stub(SalteAuthProfile.prototype, '$validate').returns({
        code: 'stuff_broke',
        description: 'what did you break!'
      });
      sinon.stub(SalteAuthProfile.prototype, '$redirectUrl').get(() => 'error');

      delete window.salte.auth;

      auth = new SalteAuth({
        provider: 'auth0',
        redirectLoginCallback: error => {
          expect(error).to.deep.equal({
            code: 'stuff_broke',
            description: 'what did you break!'
          });
          done();
        }
      });

      expect(location.href).to.equal(url);
    });

    it('should disable automatic token renewal when the screen loses visibility', () => {
      sinon.stub(SalteAuth.prototype, '$$onVisibilityChanged');
      sinon.stub(SalteAuthProfile.prototype, '$redirectUrl').get(() => false);
      sinon.stub(SalteAuthUtilities.prototype, '$iframe').get(() => false);
      sinon.stub(SalteAuthUtilities.prototype, '$popup').get(() => false);

      delete window.salte.auth;

      auth = new SalteAuth({
        provider: 'auth0'
      });

      const promise = new Promise((resolve) => {
        document.addEventListener('visibilitychange', resolve);
      });

      expect(auth.$$onVisibilityChanged.callCount).to.equal(0);
      const event = document.createEvent('Event');
      event.initEvent('visibilitychange', false, true);
      document.dispatchEvent(event);
      return promise.then(() => {
        expect(auth.$$onVisibilityChanged.callCount).to.equal(1);
      });
    });

    it('should invoke "$$refreshToken" on "refresh"', () => {
      sinon.stub(SalteAuth.prototype, '$$refreshToken');

      expect(auth.$$refreshToken.callCount).to.equal(0);

      auth.$fire('refresh');

      expect(auth.$$refreshToken.callCount).to.equal(1);
    });

    it('should initialize "$$refreshToken" if the id token has not expired', () => {
      sinon.stub(SalteAuth.prototype, '$$refreshToken');

      sinon.stub(SalteAuthProfile.prototype, '$idToken').get(() => {
        return `12345.${btoa(JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          exp: Date.now() + 10000
        }))}.12345`;
      });

      delete window.salte.auth;

      auth = new SalteAuth({
        provider: 'auth0'
      });

      expect(auth.$$refreshToken.callCount).to.equal(1);
    });

    it('should not initialize "$$refreshToken" if the id token has expired', () => {
      sinon.stub(SalteAuth.prototype, '$$refreshToken');

      sinon.stub(SalteAuthProfile.prototype, '$idToken').get(() => {
        return `12345.${btoa(JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          exp: 0
        }))}.12345`;
      });

      delete window.salte.auth;

      auth = new SalteAuth({
        provider: 'auth0'
      });

      expect(auth.$$refreshToken.callCount).to.equal(0);
    });

    it('should not invoke "$$refreshToken" when "refresh" errors', () => {
      sinon.stub(SalteAuth.prototype, '$$refreshToken');

      expect(auth.$$refreshToken.callCount).to.equal(0);

      auth.$fire('refresh', 'error!');

      expect(auth.$$refreshToken.callCount).to.equal(0);
    });
  });

  describe('interceptor(fetch)', () => {
    it('should request a new access token if we are not authenticated', () => {
      delete window.salte.auth;

      auth = new SalteAuth({
        provider: 'auth0',
        endpoints: [`${location.protocol}//${location.host}`]
      });

      sinon
        .stub(auth, 'retrieveAccessToken')
        .returns(Promise.resolve('55555-55555'));

      auth.$utilities.addFetchInterceptor((request) => {
        return Promise.resolve().then(() => {
          expect(request.headers.get('Authorization')).to.equal('Bearer 55555-55555');
        });
      });

      return fetch('/');
    });
  });

  describe('interceptor(fetch)', () => {
    it('should request a new access token if we are not authenticated', () => {
      sinon.stub(auth, 'retrieveAccessToken').returns(Promise.resolve('55555-55555'));
      auth.$config = {
        endpoints: [
          `${location.protocol}//${location.host}`
        ]
      };
    });

    it('should not request a new access token if we do not need to be authenticated', () => {
      auth.$utilities.addFetchInterceptor((request) => {
        return Promise.resolve().then(() => {
          expect(request.headers.get('Authorization')).to.equal(null);
        });
      });

      return fetch('/');
    });
  });

  describe('interceptor(xhr)', () => {
    it('should request a new access token if we are not authenticated', done => {
      sinon.stub(SalteAuth.prototype, 'retrieveAccessToken').returns(Promise.resolve('55555-55555'));

      delete window.salte.auth;

      auth = new SalteAuth({
        provider: 'auth0',
        endpoints: [`${location.protocol}//${location.host}`]
      });

      const setRequestHeaderSpy = sinon.spy(
        XMLHttpRequest.prototype,
        'setRequestHeader'
      );

      expect(setRequestHeaderSpy.callCount).to.equal(0);

      const request = new XMLHttpRequest();
      request.addEventListener('load', () => {
        expect(setRequestHeaderSpy.callCount).to.equal(1);
        expect(setRequestHeaderSpy.firstCall.args).to.deep.equal([
          'Authorization',
          'Bearer 55555-55555'
        ]);
        done();
      }, { passive: true });

      request.open('GET', '/');
      request.send();
    });

    it('should request a new access token if we are not authenticated', done => {
      sinon.stub(SalteAuth.prototype, 'retrieveAccessToken').returns(Promise.resolve('55555-55555'));

      delete window.salte.auth;

      auth = new SalteAuth({
        provider: 'auth0'
      });

      const setRequestHeaderSpy = sinon.spy(
        XMLHttpRequest.prototype,
        'setRequestHeader'
      );

      expect(setRequestHeaderSpy.callCount).to.equal(0);

      const request = new XMLHttpRequest();
      request.addEventListener('load', () => {
        expect(setRequestHeaderSpy.callCount).to.equal(0);
        done();
      }, { passive: true });

      request.open('GET', '/');
      request.send();
    });
  });

  describe('getter($provider)', () => {
    it('should return a provider', () => {
      delete window.salte.auth;

      auth = new SalteAuth({
        provider: 'auth0'
      });

      expect(auth.$provider).to.not.be.undefined;
    });

    it('should support custom providers', () => {
      delete window.salte.auth;

      auth = new SalteAuth({
        provider: class {}
      });

      expect(auth.$provider).to.equal(auth.$config.provider);
    });

    it('should throw an error if the provider is unsupported', () => {
      auth.$config.provider = 'bogus';

      expect(() => auth.$provider).to.throw('Unknown Provider (bogus)');
    });

    it('should throw an error if the provider was not specified', () => {
      auth.$config.provider = null;

      expect(() => auth.$provider).to.throw('A provider must be specified');
    });
  });

  // TODO: Make this more thorough by including more config params
  describe('getter($accessTokenUrl)', () => {
    it('should compute the accessTokenUrl', () => {
      delete window.salte.auth;

      auth = new SalteAuth({
        providerUrl: 'https://api.salte.io',
        redirectUrl: `${location.protocol}//${location.host}`,
        clientId: 'Hzl9Rvu_Ws_s1QKIhI2TXi8NZRn672FC',
        scope: 'openid',
        provider: 'auth0'
      });

      expect(auth.$accessTokenUrl).to.equal(
        `https://api.salte.io/authorize?state=33333333-3333-4333-b333-333333333333&nonce=33333333-3333-4333-b333-333333333333&response_type=token&redirect_uri=${encodeURIComponent(
          `${location.protocol}//${location.host}`
        )}&client_id=Hzl9Rvu_Ws_s1QKIhI2TXi8NZRn672FC&scope=openid&prompt=none`
      );
    });

    it('should utilize authorizeUrl overrides', () => {
      delete window.salte.auth;

      auth = new SalteAuth({
        providerUrl: 'https://mydomain.auth.us-east-1.amazoncognito.com',
        redirectUrl: `${location.protocol}//${location.host}`,
        clientId: 'Hzl9Rvu_Ws_s1QKIhI2TXi8NZRn672FC',
        scope: 'openid',
        provider: 'cognito'
      });

      expect(auth.$accessTokenUrl).to.equal(
        `https://mydomain.auth.us-east-1.amazoncognito.com/oauth2/authorize?state=33333333-3333-4333-b333-333333333333&nonce=33333333-3333-4333-b333-333333333333&response_type=token&redirect_uri=${encodeURIComponent(
          `${location.protocol}//${location.host}`
        )}&client_id=Hzl9Rvu_Ws_s1QKIhI2TXi8NZRn672FC&scope=openid&prompt=none`
      );
    });

    it('should support a separate loginUrl', () => {
      delete window.salte.auth;

      auth = new SalteAuth({
        providerUrl: 'https://mydomain.auth.us-east-1.amazoncognito.com',
        redirectUrl: {
          loginUrl: `${location.protocol}//${location.host}`
        },
        clientId: 'Hzl9Rvu_Ws_s1QKIhI2TXi8NZRn672FC',
        scope: 'openid',
        provider: 'cognito'
      });

      expect(auth.$accessTokenUrl).to.equal(
        `https://mydomain.auth.us-east-1.amazoncognito.com/oauth2/authorize?state=33333333-3333-4333-b333-333333333333&nonce=33333333-3333-4333-b333-333333333333&response_type=token&redirect_uri=${encodeURIComponent(
          `${location.protocol}//${location.host}`
        )}&client_id=Hzl9Rvu_Ws_s1QKIhI2TXi8NZRn672FC&scope=openid&prompt=none`
      );
    });
  });

  describe('function($loginUrl)', () => {
    it('should compute the loginUrl', () => {
      delete window.salte.auth;

      auth = new SalteAuth({
        providerUrl: 'https://api.salte.io',
        responseType: 'id_token',
        redirectUrl: `${location.protocol}//${location.host}`,
        clientId: 'Hzl9Rvu_Ws_s1QKIhI2TXi8NZRn672FC',
        scope: 'openid',
        provider: 'auth0'
      });

      expect(auth.$loginUrl()).to.equal(
        `https://api.salte.io/authorize?state=33333333-3333-4333-b333-333333333333&nonce=33333333-3333-4333-b333-333333333333&response_type=id_token&redirect_uri=${encodeURIComponent(
          `${location.protocol}//${location.host}`
        )}&client_id=Hzl9Rvu_Ws_s1QKIhI2TXi8NZRn672FC&scope=openid`
      );
    });

    it('should utilize authorizeEndpoint overrides', () => {
      delete window.salte.auth;

      auth = new SalteAuth({
        providerUrl: 'https://mydomain.auth.us-east-1.amazoncognito.com',
        responseType: 'id_token',
        redirectUrl: `${location.protocol}//${location.host}`,
        clientId: 'Hzl9Rvu_Ws_s1QKIhI2TXi8NZRn672FC',
        scope: 'openid',
        provider: 'cognito'
      });

      expect(auth.$loginUrl()).to.equal(
        `https://mydomain.auth.us-east-1.amazoncognito.com/oauth2/authorize?state=33333333-3333-4333-b333-333333333333&nonce=33333333-3333-4333-b333-333333333333&response_type=id_token&redirect_uri=${encodeURIComponent(
          `${location.protocol}//${location.host}`
        )}&client_id=Hzl9Rvu_Ws_s1QKIhI2TXi8NZRn672FC&scope=openid`
      );
    });

    it('should support a separate loginUrl', () => {
      delete window.salte.auth;

      auth = new SalteAuth({
        providerUrl: 'https://mydomain.auth.us-east-1.amazoncognito.com',
        responseType: 'id_token',
        redirectUrl: {
          loginUrl: `${location.protocol}//${location.host}`
        },
        clientId: 'Hzl9Rvu_Ws_s1QKIhI2TXi8NZRn672FC',
        scope: 'openid',
        provider: 'cognito'
      });

      expect(auth.$loginUrl()).to.equal(
        `https://mydomain.auth.us-east-1.amazoncognito.com/oauth2/authorize?state=33333333-3333-4333-b333-333333333333&nonce=33333333-3333-4333-b333-333333333333&response_type=id_token&redirect_uri=${encodeURIComponent(
          `${location.protocol}//${location.host}`
        )}&client_id=Hzl9Rvu_Ws_s1QKIhI2TXi8NZRn672FC&scope=openid`
      );
    });
  });

  describe('getter($deauthorizeUrl)', () => {
    it('should compute the deauthorizeUrl', done => {
      delete window.salte.auth;

      auth = new SalteAuth({
        providerUrl: 'https://api.salte.io',
        responseType: 'id_token',
        redirectUrl: `${location.protocol}//${location.host}`,
        clientId: 'Hzl9Rvu_Ws_s1QKIhI2TXi8NZRn672FC',
        scope: 'openid',

        provider: 'auth0'
      });

      sinon
        .stub(auth.$provider, 'deauthorizeUrl')
        .callsFake(function(config) {
          expect(this).to.be.an.instanceof(SalteAuth);
          expect(config).to.deep.equal(salte.auth.$config);
          done();
        });

      auth.$deauthorizeUrl;
    });
  });

  describe('function(on)', () => {
    it('should register a listener', () => {
      const reference = function() {};
      auth.on('login', reference);

      expect(auth.$listeners.login.indexOf(reference)).to.deep.equal(2);
    });

    it('should throw an error if an invalid event type is provided', () => {
      expect(() => auth.on('bogus')).to.throw(ReferenceError, 'Unknown Event Type (bogus)');
    });

    it('should throw an error if an invalid callback is provided', () => {
      expect(() => auth.on('login')).to.throw(ReferenceError, 'Invalid callback provided!');
    });
  });

  describe('function(off)', () => {
    it('should deregister a listener', () => {
      const reference = function() {};
      auth.on('login', reference);

      expect(auth.$listeners.login.indexOf(reference)).to.deep.equal(2);

      auth.off('login', reference);

      expect(auth.$listeners.login.indexOf(reference)).to.deep.equal(-1);
    });

    it('should bail if the listeners are falsy or the list is empty', () => {
      const reference = function() {};

      auth.off('login', reference);

      expect(auth.$listeners.login.indexOf(reference)).to.deep.equal(-1);

      auth.on('login', reference);
      auth.off('login', reference);
      auth.off('login', reference);

      expect(auth.$listeners.login.indexOf(reference)).to.deep.equal(-1);
    });

    it('should throw an error if an invalid event type is provided', () => {
      expect(() => auth.off('bogus')).to.throw(ReferenceError, 'Unknown Event Type (bogus)');
    });

    it('should throw an error if an invalid callback is provided', () => {
      expect(() => auth.off('login')).to.throw(ReferenceError, 'Invalid callback provided!');
    });
  });

  describe('function($fire)', () => {
    it('should fire off an event to all listeners', () => {
      const promise = new Promise((resolve, reject) => {
        auth.on('logout', (error) => {
          if (error) return reject(error);

          return resolve();
        });
      });

      auth.$fire('logout');

      return promise;
    });

    it('should fire an event off on the window', () => {
      const promise = new Promise((resolve, reject) => {
        window.addEventListener('salte-auth-logout', (ev) => {
          if (ev.detail.error) {
            return reject(ev.detail.error);
          }

          return resolve();
        });
      });

      auth.$fire('logout');

      return promise;
    });

    it('should bail if the listeners are falsy or the list is empty', () => {
      auth.$fire('bogus');

      auth.$listeners.bogus = [];

      auth.$fire('bogus');
    });
  });

  describe('function(loginWithIframe)', () => {
    beforeEach(() => {
      auth.profile.$clear();
      sinon.stub(SalteAuthProfile.prototype, '$clear');
      sinon.stub(SalteAuthUtilities.prototype, 'createIframe').returns(Promise.resolve());
      delete window.salte.auth;
      auth = new SalteAuth({
        providerUrl: `${location.protocol}//${location.host}`,
        provider: 'auth0'
      });
    });

    it('should resolve when we have logged in', () => {
      sinon.stub(auth.profile, '$validate');

      const promise = auth.loginWithIframe();

      expect(auth.profile.$clear.callCount).to.equal(1);
      expect(auth.$promises.login).to.equal(promise);
      return promise.then((user) => {
        expect(user).to.deep.equal(auth.profile.userInfo);
        expect(auth.$promises.login).to.equal(null);
      });
    });

    it('should fire off a "login" event when successful', () => {
      const promise = new Promise((resolve, reject) => {
        auth.on('login', (error, user) => {
          if (error) return reject(error);

          return resolve(user);
        });
      });

      sinon.stub(auth.profile, '$validate');

      auth.loginWithIframe();

      return promise.then((user) => {
        expect(auth.$utilities.createIframe.calledWith(sinon.match(/.+/), true)).to.equal(true);
        expect(user).to.deep.equal(auth.profile.userInfo);
      });
    });

    it('should not fire off a "login" event if this is a refresh request', () => {
      const onLogin = sinon.stub();
      auth.on('login', onLogin);

      sinon.stub(auth.profile, '$validate');

      return auth.loginWithIframe(true).then((user) => {
        expect(auth.$utilities.createIframe.calledWith(sinon.match(/.+/), false)).to.equal(true);
        expect(onLogin.callCount).to.equal(0);
        expect(user).to.deep.equal(auth.profile.userInfo);
      });
    });

    it('should support clearing the entire profile', () => {
      sinon.stub(auth.profile, '$validate');

      return auth.loginWithIframe({
        clear: 'all'
      }).then((user) => {
        expect(auth.profile.$clear.callCount).to.equal(1);
      });
    });

    it('should support clearing only errors', () => {
      sinon.stub(auth.profile, '$clearErrors');
      sinon.stub(auth.profile, '$validate');

      return auth.loginWithIframe({
        clear: 'errors'
      }).then((user) => {
        expect(auth.profile.$clearErrors.callCount).to.equal(1);
      });
    });

    it('should support disabling profile clearing', () => {
      sinon.stub(auth.profile, '$clearErrors');
      sinon.stub(auth.profile, '$validate');

      return auth.loginWithIframe({
        clear: false
      }).then((user) => {
        expect(auth.profile.$clear.callCount).to.equal(0);
        expect(auth.profile.$clearErrors.callCount).to.equal(0);
      });
    });

    it('should support disabling prompt-based login', () => {
      sinon.stub(auth.profile, '$validate');

      return auth.loginWithIframe({
        noPrompt: true
      }).then((user) => {
        expect(auth.$utilities.createIframe.calledWith(sinon.match(/.+/), false)).to.equal(true);
        expect(user).to.deep.equal(auth.profile.userInfo);
      });
    });

    it('should support disabling events', () => {
      const onLogin = sinon.stub();
      auth.on('login', onLogin);

      sinon.stub(auth.profile, '$validate');

      return auth.loginWithIframe({
        events: false
      }).then((user) => {
        expect(auth.$utilities.createIframe.calledWith(sinon.match(/.+/), true)).to.equal(true);
        expect(onLogin.callCount).to.equal(0);
        expect(user).to.deep.equal(auth.profile.userInfo);
      });
    });

    it('should fire off a "login" event on failures', () => {
      const promise = new Promise((resolve, reject) => {
        auth.on('login', (error, user) => {
          if (error) return resolve(error);

          return Promise.reject('Promise unexpectedly resolved.');
        });
      });

      sinon.stub(auth, '$loginUrl').returns('');
      auth.$utilities.createIframe.restore();
      sinon
        .stub(auth.$utilities, 'createIframe')
        .returns(Promise.reject('Iframe Failed!'));

      auth.loginWithIframe();

      return promise.then((error) => {
        expect(error).to.equal('Iframe Failed!');
      });
    });

    it('should prevent duplicate promises', () => {
      sinon.stub(auth.profile, '$validate');

      const promise = auth.loginWithIframe();
      const duplicatePromise = auth.loginWithIframe();

      expect(promise).to.equal(duplicatePromise);

      return promise;
    });

    it('should throw validation errors', () => {
      const promise = auth.loginWithIframe();

      return promise.catch(error => {
        return error;
      }).then(error => {
        expect(error.code).to.equal('invalid_state');
      });
    });

    it('should handle the iframe failing', () => {
      sinon.stub(auth, '$loginUrl').returns('');
      auth.$utilities.createIframe.restore();
      sinon
        .stub(auth.$utilities, 'createIframe')
        .returns(Promise.reject('Iframe Failed!'));

      const promise = auth.loginWithIframe();

      return promise.catch(error => {
        return error;
      }).then(error => {
        expect(error).to.deep.equal('Iframe Failed!');
        expect(auth.$promises.login).to.deep.equal(null);
      });
    });
  });

  describe('function(loginWithPopup)', () => {
    it('should resolve when we have logged in', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$loginUrl').returns('');
      sinon.stub(auth.$utilities, 'openPopup').returns(Promise.resolve());
      sinon.stub(auth.profile, '$validate');
      sinon.stub(auth.profile, '$hash');

      const promise = auth.loginWithPopup();

      expect(auth.profile.$clear.callCount).to.equal(1);
      expect(auth.$promises.login).to.equal(promise);
      expect(auth.profile.$hash.callCount).to.equal(0);

      return promise.then((user) => {
        expect(user).to.deep.equal(auth.profile.userInfo);
        expect(auth.profile.$hash.callCount).to.equal(1);
        expect(auth.$promises.login).to.equal(null);
      });
    });

    it('should fire off a "login" event when successful', () => {
      const promise = new Promise((resolve, reject) => {
        auth.on('login', (error, user) => {
          if (error) return reject(error);

          return resolve(user);
        });
      });

      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$loginUrl').returns('');
      sinon.stub(auth.$utilities, 'openPopup').returns(Promise.resolve());
      sinon.stub(auth.profile, '$validate');
      sinon.stub(auth.profile, '$hash');

      auth.loginWithPopup();

      return promise.then((user) => {
        expect(user).to.deep.equal(auth.profile.userInfo);
      });
    });

    it('should fire off a "login" event on failures', () => {
      const promise = new Promise((resolve, reject) => {
        auth.on('login', (error, user) => {
          if (error) return resolve(error);

          return Promise.reject('Promise unexpectedly resolved.');
        });
      });

      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$loginUrl').returns('');
      sinon
        .stub(auth.$utilities, 'openPopup')
        .returns(Promise.reject('Popup blocked!'));

      auth.loginWithPopup();

      return promise.then((error) => {
        expect(error).to.equal('Popup blocked!');
      });
    });

    it('should prevent duplicate promises', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$loginUrl').returns('');
      sinon.stub(auth.$utilities, 'openPopup').returns(Promise.resolve());
      sinon.stub(auth.profile, '$validate');

      const promise = auth.loginWithPopup();
      const duplicatePromise = auth.loginWithPopup();

      expect(promise).to.equal(duplicatePromise);

      return promise;
    });

    it('should throw validation errors', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth.$utilities, 'openPopup').returns(Promise.resolve());

      const promise = auth.loginWithPopup();

      return promise.catch(error => {
        return error;
      }).then(error => {
        expect(error.code).to.equal('invalid_state');
      });
    });

    it('should handle a popup being blocked', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$loginUrl').returns('');
      sinon
        .stub(auth.$utilities, 'openPopup')
        .returns(Promise.reject('Popup blocked!'));

      const promise = auth.loginWithPopup();

      return promise.catch(error => {
        return error;
      }).then(error => {
        expect(error).to.deep.equal('Popup blocked!');
        expect(auth.$promises.login).to.deep.equal(null);
      });
    });
  });

  describe('function(loginWithNewTab)', () => {
    it('should resolve when we have logged in', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$loginUrl').returns('');
      sinon.stub(auth.$utilities, 'openNewTab').returns(Promise.resolve());
      sinon.stub(auth.profile, '$validate');
      sinon.stub(auth.profile, '$hash');

      const promise = auth.loginWithNewTab();

      expect(auth.profile.$clear.callCount).to.equal(1);
      expect(auth.$promises.login).to.equal(promise);
      expect(auth.profile.$hash.callCount).to.equal(0);

      return promise.then((user) => {
        expect(user).to.deep.equal(auth.profile.userInfo);
        expect(auth.profile.$hash.callCount).to.equal(1);
        expect(auth.$promises.login).to.equal(null);
      });
    });

    it('should fire off a "login" event when successful', () => {
      const promise = new Promise((resolve, reject) => {
        auth.on('login', (error, user) => {
          if (error) return reject(error);

          return resolve(user);
        });
      });

      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$loginUrl').returns('');
      sinon.stub(auth.$utilities, 'openNewTab').returns(Promise.resolve());
      sinon.stub(auth.profile, '$validate');
      sinon.stub(auth.profile, '$hash');

      auth.loginWithNewTab();

      return promise.then((user) => {
        expect(user).to.deep.equal(auth.profile.userInfo);
      });
    });

    it('should fire off a "login" event on failures', () => {
      const promise = new Promise((resolve, reject) => {
        auth.on('login', (error, user) => {
          if (error) return resolve(error);

          return Promise.reject('Promise unexpectedly resolved.');
        });
      });

      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$loginUrl').returns('');
      sinon
        .stub(auth.$utilities, 'openNewTab')
        .returns(Promise.reject('New Tab blocked!'));

      auth.loginWithNewTab();

      return promise.then((error) => {
        expect(error).to.equal('New Tab blocked!');
      });
    });

    it('should prevent duplicate promises', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$loginUrl').returns('');
      sinon.stub(auth.$utilities, 'openNewTab').returns(Promise.resolve());
      sinon.stub(auth.profile, '$validate');

      const promise = auth.loginWithNewTab();
      const duplicatePromise = auth.loginWithNewTab();

      expect(promise).to.equal(duplicatePromise);

      return promise;
    });

    it('should throw validation errors', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth.$utilities, 'openNewTab').returns(Promise.resolve());

      const promise = auth.loginWithNewTab();

      return promise.catch(error => {
        return error;
      }).then(error => {
        expect(error.code).to.equal('invalid_state');
      });
    });

    it('should handle a popup being blocked', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$loginUrl').returns('');
      sinon
        .stub(auth.$utilities, 'openNewTab')
        .returns(Promise.reject('New Tab blocked!'));

      const promise = auth.loginWithNewTab();

      return promise.catch(error => {
        return error;
      }).then(error => {
        expect(error).to.deep.equal('New Tab blocked!');
        expect(auth.$promises.login).to.deep.equal(null);
      });
    });
  });

  describe('function(loginWithRedirect)', () => {
    beforeEach(() => {
      window.setTimeout.restore();
      sinon.stub(auth.profile, '$clear');
    });

    it('should resolve when we have logged in', () => {
      auth.$config.redirectLoginCallback = sinon.stub();

      expect(console.warn.callCount).to.equal(0);

      auth.loginWithRedirect();

      expect(console.warn.callCount).to.equal(1);

      expect(auth.profile.$clear.callCount).to.equal(1);
      expect(auth.profile.$redirectUrl).to.equal(location.href);
      expect(auth.$promises.logout).to.be.undefined;
    });

    it('should prevent duplicate promises', () => {
      auth.$config.redirectLoginCallback = sinon.stub();

      const promise = auth.loginWithRedirect();
      const duplicatePromise = auth.loginWithRedirect();

      expect(promise).to.equal(duplicatePromise);

      expect(auth.profile.$clear.callCount).to.equal(1);
      expect(auth.profile.$redirectUrl).to.equal(location.href);
    });

    it('should log a deprecation warning if the user utilizes "redirectLoginCallback".', () => {
      auth.$config.redirectLoginCallback = sinon.stub();

      expect(console.warn.callCount).to.equal(0);

      auth.loginWithRedirect();

      expect(console.warn.callCount).to.equal(1);
    });

    it('should support overriding the redirectUrl with absolute urls', () => {
      auth.loginWithRedirect('https://google.com');

      expect(auth.profile.$redirectUrl).to.equal('https://google.com');
    });

    it('should support overriding the redirectUrl with relative urls', () => {
      auth.loginWithRedirect('/dashboard');

      expect(auth.profile.$redirectUrl).to.equal(`${window.location.protocol}//${window.location.host}/dashboard`);
    });
  });

  describe('function(logoutWithIframe)', () => {
    it('should resolve when we have logged out', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$deauthorizeUrl').get(() => '');
      sinon.stub(auth.$utilities, 'createIframe').returns(Promise.resolve());

      const promise = auth.logoutWithIframe();

      expect(auth.profile.$clear.callCount).to.equal(1);
      expect(auth.$promises.logout).to.equal(promise);
      return promise.then(() => {
        expect(auth.$promises.logout).to.equal(null);
      });
    });

    it('should fire off a "logout" event when successful', () => {
      const promise = new Promise((resolve, reject) => {
        auth.on('logout', (error, user) => {
          if (error) return reject(error);

          return resolve(user);
        });
      });

      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$deauthorizeUrl').get(() => '');
      sinon.stub(auth.$utilities, 'createIframe').returns(Promise.resolve());

      auth.logoutWithIframe();

      return promise;
    });

    it('should fire off a "logout" event on failures', () => {
      const promise = new Promise((resolve, reject) => {
        auth.on('logout', (error, user) => {
          if (error) return resolve(error);

          return Promise.reject('Promise unexpectedly resolved.');
        });
      });

      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$deauthorizeUrl').get(() => '');
      sinon.stub(auth.$utilities, 'createIframe').returns(Promise.reject('Iframe blocked!'));

      auth.logoutWithIframe();

      return promise.then((error) => {
        expect(error).to.equal('Iframe blocked!');
      });
    });

    it('should prevent duplicate promises', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$deauthorizeUrl').get(() => '');
      sinon.stub(auth.$utilities, 'createIframe').returns(Promise.resolve());

      const promise = auth.logoutWithIframe();
      const duplicatePromise = auth.logoutWithIframe();

      expect(promise).to.equal(duplicatePromise);

      return promise;
    });

    it('should support failures', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$deauthorizeUrl').get(() => '');
      sinon.stub(auth.$utilities, 'createIframe').returns(Promise.reject('Iframe blocked!'));

      return auth.logoutWithIframe().catch((error) => error).then((error) => {
        expect(error).to.equal('Iframe blocked!');
        expect(auth.$promises.logout).to.equal(null);
      });
    });
  });

  describe('function(logoutWithPopup)', () => {
    it('should resolve when we have logged out', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$deauthorizeUrl').get(() => '');
      sinon.stub(auth.$utilities, 'openPopup').returns(Promise.resolve());

      const promise = auth.logoutWithPopup();

      expect(auth.profile.$clear.callCount).to.equal(1);
      expect(auth.$promises.logout).to.equal(promise);
      return promise.then(() => {
        expect(auth.$promises.logout).to.equal(null);
      });
    });

    it('should fire off a "logout" event when successful', () => {
      const promise = new Promise((resolve, reject) => {
        auth.on('logout', (error, user) => {
          if (error) return reject(error);

          return resolve(user);
        });
      });

      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$deauthorizeUrl').get(() => '');
      sinon.stub(auth.$utilities, 'openPopup').returns(Promise.resolve());

      auth.logoutWithPopup();

      return promise;
    });

    it('should fire off a "logout" event on failures', () => {
      const promise = new Promise((resolve, reject) => {
        auth.on('logout', (error, user) => {
          if (error) return resolve(error);

          return Promise.reject('Promise unexpectedly resolved.');
        });
      });

      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$deauthorizeUrl').get(() => '');
      sinon.stub(auth.$utilities, 'openPopup').returns(Promise.reject('Popup blocked!'));

      auth.logoutWithPopup();

      return promise.then((error) => {
        expect(error).to.equal('Popup blocked!');
      });
    });

    it('should prevent duplicate promises', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$deauthorizeUrl').get(() => '');
      sinon.stub(auth.$utilities, 'openPopup').returns(Promise.resolve());
      sinon.stub(auth.profile, '$validate');

      const promise = auth.logoutWithPopup();
      const duplicatePromise = auth.logoutWithPopup();

      expect(promise).to.equal(duplicatePromise);

      return promise;
    });

    it('should support failures', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$deauthorizeUrl').get(() => '');
      sinon.stub(auth.$utilities, 'openPopup').returns(Promise.reject('Popup blocked!'));

      return auth.logoutWithPopup().catch((error) => error).then((error) => {
        expect(error).to.equal('Popup blocked!');
        expect(auth.$promises.logout).to.equal(null);
      });
    });
  });

  describe('function(logoutWithNewTab)', () => {
    it('should resolve when we have logged out', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$deauthorizeUrl').get(() => '');
      sinon.stub(auth.$utilities, 'openNewTab').returns(Promise.resolve());

      const promise = auth.logoutWithNewTab();

      expect(auth.profile.$clear.callCount).to.equal(1);
      expect(auth.$promises.logout).to.equal(promise);
      return promise.then(() => {
        expect(auth.$promises.logout).to.equal(null);
      });
    });

    it('should fire off a "logout" event when successful', () => {
      const promise = new Promise((resolve, reject) => {
        auth.on('logout', (error, user) => {
          if (error) return reject(error);

          return resolve(user);
        });
      });

      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$deauthorizeUrl').get(() => '');
      sinon.stub(auth.$utilities, 'openNewTab').returns(Promise.resolve());

      auth.logoutWithNewTab();

      return promise;
    });

    it('should fire off a "logout" event on failures', () => {
      const promise = new Promise((resolve, reject) => {
        auth.on('logout', (error, user) => {
          if (error) return resolve(error);

          return Promise.reject('Promise unexpectedly resolved.');
        });
      });

      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$deauthorizeUrl').get(() => '');
      sinon.stub(auth.$utilities, 'openNewTab').returns(Promise.reject('New Tab blocked!'));

      auth.logoutWithNewTab();

      return promise.then((error) => {
        expect(error).to.equal('New Tab blocked!');
      });
    });

    it('should prevent duplicate promises', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$deauthorizeUrl').get(() => '');
      sinon.stub(auth.$utilities, 'openNewTab').returns(Promise.resolve());
      sinon.stub(auth.profile, '$validate');

      const promise = auth.logoutWithNewTab();
      const duplicatePromise = auth.logoutWithNewTab();

      expect(promise).to.equal(duplicatePromise);

      return promise;
    });

    it('should support failures', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$deauthorizeUrl').get(() => '');
      sinon.stub(auth.$utilities, 'openNewTab').returns(Promise.reject('New Tab blocked!'));

      return auth.logoutWithNewTab().catch((error) => error).then((error) => {
        expect(error).to.equal('New Tab blocked!');
        expect(auth.$promises.logout).to.equal(null);
      });
    });
  });

  describe('function(logoutWithRedirect)', () => {
    it('should resolve when we have logged out', () => {
      sinon.stub(auth.profile, '$clear');
      sinon.stub(auth, '$deauthorizeUrl').get(() => location.href);

      auth.logoutWithRedirect();

      expect(auth.profile.$clear.callCount).to.equal(1);
      expect(auth.$promises.logout).to.be.undefined;
    });
  });

  describe('function(refreshToken)', () => {
    beforeEach(() => {
      delete auth.$timeouts.refresh;
      sinon.stub(auth, 'loginWithIframe').returns(Promise.resolve());
      sinon.stub(auth.profile, 'idTokenExpired').get(() => true);
      sinon.stub(auth.profile, 'accessTokenExpired').get(() => true);
      sinon.stub(auth.profile, '$clearErrors');
      sinon.stub(auth.profile, '$validate');
      sinon.stub(auth.$utilities, 'createIframe').returns(Promise.resolve());
    });

    it('should register a timeout to execute a minute before the token expires', () => {
      expect(clearTimeout.callCount).to.equal(0);
      return auth.refreshToken().then(() => {
        expect(auth.loginWithIframe.calledWith(true)).to.equal(true);
        expect(clearTimeout.callCount).to.equal(0);
      });
    });

    it('should fire off a "refresh" event if we successfully refresh the token', () => {
      const promise = new Promise((resolve, reject) => {
        auth.on('refresh', (error, user) => {
          if (error) return reject(error);

          return resolve(user);
        });
      });
      expect(clearTimeout.callCount).to.equal(0);

      auth.refreshToken();

      return promise.then(() => {
        expect(auth.loginWithIframe.calledWith(true)).to.equal(true);
        expect(clearTimeout.callCount).to.equal(0);
      });
    });

    it('should fire off a "refresh" event if we fail to refresh the token', () => {
      auth.loginWithIframe.restore();
      sinon.stub(auth, 'loginWithIframe').returns(Promise.reject('Iframe failed!'));
      const promise = new Promise((resolve, reject) => {
        auth.on('refresh', (error, user) => {
          if (error) return reject(error);

          return resolve(user);
        });
      });
      expect(clearTimeout.callCount).to.equal(0);

      auth.refreshToken();

      return promise.catch((error) => error).then((error) => {
        expect(error).to.equal('Iframe failed!');
      });
    });

    it('should throw validation errors', () => {
      auth.profile.$validate.restore();
      sinon.stub(auth.profile, 'idTokenExpired').get(() => false);
      sinon.stub(auth.profile, 'accessTokenExpired').get(() => true);

      const promise = auth.refreshToken();

      return promise.catch(error => {
        return error;
      }).then(error => {
        expect(error.code).to.equal('invalid_state');
      });
    });

    it('should support errors', () => {
      auth.loginWithIframe.restore();
      sinon
        .stub(auth, 'loginWithIframe')
        .returns(Promise.reject('Iframe Failed!'));

      const promise = auth.refreshToken();

      expect(promise).to.equal(auth.refreshToken());
      expect(auth.$promises.token).to.equal(promise);

      return promise.catch(error => {
        return error;
      }).then(error => {
        expect(error).to.equal('Iframe Failed!');
      });
    });

    it('should dedupe requests', () => {
      const promise = auth.refreshToken();

      expect(promise).to.equal(auth.refreshToken());
      expect(auth.$promises.token).to.equal(promise);

      return promise;
    });
  });

  describe('function($$refreshToken)', () => {
    it('should invoke "refreshToken"', () => {
      window.setTimeout.restore();
      const promise = new Promise((resolve) => {
        sinon.stub(window, 'setTimeout').callsFake((func) => {
          func();
          resolve();
        });
      });
      sinon.stub(auth, 'refreshToken').returns(Promise.resolve());

      auth.$$refreshToken();

      return promise;
    });

    it('should log errors returned by "refreshToken"', () => {
      window.setTimeout.restore();
      const promise = new Promise((resolve) => {
        sinon.stub(window, 'setTimeout').callsFake((func) => {
          func();
          resolve();
        });
      });
      sinon.stub(auth, 'refreshToken').returns(Promise.reject('Iframe Failed!'));

      auth.$$refreshToken();

      return promise.then(() => {
        expect(console.error.calledWith('Iframe Failed!')).to.equal(true);
      });
    });

    it('should register a timeout based on when the token will expire', () => {
      const timeout = auth.$timeouts.refresh;

      auth.$$refreshToken();

      expect(timeout).to.not.equal(auth.$timeouts.refresh);
    });

    it('should deregister an outdated timeout', () => {
      expect(clearTimeout.callCount).to.equal(0);

      auth.$$refreshToken();

      expect(clearTimeout.callCount).to.equal(0);

      auth.$$refreshToken();

      expect(clearTimeout.callCount).to.equal(2);
    });

    it('should not invoke "refreshToken" if autoRefresh is false', () => {
      window.setTimeout.restore();
      auth.$config.autoRefresh = false;

      const spy = sinon.spy(auth, 'refreshToken');

      auth.$$refreshToken();

      sinon.assert.notCalled(spy);
    });

    it('should fire off a "refresh" event if autoRefresh is false', () => {
      window.setTimeout.restore();
      auth.$config.autoRefresh = false;
      const promise = new Promise((resolve, reject) => {
        auth.on('refresh', () => {
          return resolve('refresh event fired');
        });
      });

      auth.$$refreshToken();

      return promise.then((resolution) => {
        expect(resolution).to.equal('refresh event fired');
      });
    });
  });

  describe('function(retrieveAccessToken)', () => {
    it('should default to using an iframe for auto logging in', () => {
      sinon.stub(auth, 'loginWithIframe').returns(Promise.resolve());
      sinon.stub(auth.profile, 'idTokenExpired').get(() => true);
      sinon.stub(auth.profile, 'accessTokenExpired').get(() => true);
      sinon.stub(auth.profile, '$clearErrors');
      sinon.stub(auth.profile, '$validate');
      sinon.stub(auth.$utilities, 'createIframe').returns(Promise.resolve());

      const promise = auth.retrieveAccessToken();

      auth.profile.$accessToken = '55555-55555';

      expect(auth.$promises.token).to.equal(promise);
      return promise.then(accessToken => {
        expect(auth.loginWithIframe.callCount).to.equal(1);
        expect(auth.profile.$clearErrors.callCount).to.equal(1);
        expect(accessToken).to.equal('55555-55555');
        expect(auth.$promises.token).to.equal(null);
      });
    });

    it('should support logging in via "redirect"', () => {
      sinon.stub(auth, 'loginWithRedirect').returns(Promise.resolve());
      sinon.stub(auth.profile, 'idTokenExpired').get(() => true);
      sinon.stub(auth.profile, 'accessTokenExpired').get(() => true);
      sinon.stub(auth.profile, '$clearErrors');
      sinon.stub(auth.profile, '$validate');
      sinon.stub(auth.$utilities, 'createIframe').returns(Promise.resolve());
      auth.$config.loginType = 'redirect';

      const promise = auth.retrieveAccessToken();

      auth.profile.$accessToken = '55555-55555';

      expect(auth.$promises.token).to.equal(promise);
      return promise.then(accessToken => {
        expect(auth.loginWithRedirect.callCount).to.equal(1);
        expect(auth.profile.$clearErrors.callCount).to.equal(1);
        expect(accessToken).to.equal('55555-55555');
        expect(auth.$promises.token).to.equal(null);
      });
    });

    it('should bypass fetching the tokens if they have not expired', () => {
      sinon.stub(auth.profile, 'idTokenExpired').get(() => false);
      sinon.stub(auth.profile, 'accessTokenExpired').get(() => false);
      sinon.stub(auth.profile, '$clearErrors');

      const promise = auth.retrieveAccessToken();

      auth.profile.$accessToken = '55555-55555';

      expect(auth.$promises.token).to.equal(promise);
      return promise.then(accessToken => {
        expect(auth.profile.$clearErrors.callCount).to.equal(1);
        expect(accessToken).to.equal('55555-55555');
        expect(auth.$promises.token).to.equal(null);
      });
    });

    it('should use an active login request if automatic login is disabled', () => {
      auth.$promises.login = Promise.resolve();
      sinon.stub(auth.profile, 'idTokenExpired').get(() => true);
      sinon.stub(auth.profile, 'accessTokenExpired').get(() => true);
      sinon.stub(auth.profile, '$clearErrors');
      sinon.stub(auth.profile, '$validate');
      sinon.stub(auth.$utilities, 'createIframe').returns(Promise.resolve());

      auth.$config.loginType = false;

      const promise = auth.retrieveAccessToken();

      auth.profile.$accessToken = '55555-55555';

      expect(auth.$promises.token).to.equal(promise);
      return promise.then(accessToken => {
        expect(auth.profile.$clearErrors.callCount).to.equal(1);
        expect(accessToken).to.equal('55555-55555');
        expect(auth.$promises.token).to.equal(null);
      });
    });

    it('should fail if automatic login is disabled', () => {
      auth.$config.loginType = false;

      const promise = auth.retrieveAccessToken();

      return promise.catch((error) => error).then((error) => {
        expect(error.message).to.equal('Automatic login is disabled, please login before making any requests!');
      });
    });

    it('should fail if the loginType is unknown', () => {
      auth.$config.loginType = 'bogus';

      const promise = auth.retrieveAccessToken();

      return promise.catch((error) => error).then((error) => {
        expect(error.message).to.equal('Invalid Login Type (bogus)');
      });
    });

    it('should fail if automatic login is disabled', () => {
      auth.$config.loginType = false;

      const promise = auth.retrieveAccessToken();

      return promise.catch((error) => error).then((error) => {
        expect(error.message).to.equal('Automatic login is disabled, please login before making any requests!');
      });
    });

    it('should prevent duplicate promises', () => {
      sinon.stub(auth, 'loginWithIframe').returns(Promise.resolve());
      sinon.stub(auth.profile, 'idTokenExpired').get(() => true);
      sinon.stub(auth.profile, 'accessTokenExpired').get(() => true);
      sinon.stub(auth.profile, '$clearErrors');
      sinon.stub(auth.profile, '$validate');
      sinon.stub(auth.$utilities, 'createIframe').returns(Promise.resolve());

      const promise = auth.retrieveAccessToken();
      const duplicatePromise = auth.retrieveAccessToken();

      auth.profile.$accessToken = '55555-55555';

      expect(promise).to.equal(duplicatePromise);
      return promise;
    });

    it('should throw validation errors', () => {
      sinon.stub(auth.profile, 'idTokenExpired').get(() => false);
      sinon.stub(auth.profile, 'accessTokenExpired').get(() => true);
      sinon.stub(auth.profile, '$clearErrors');
      sinon.stub(auth.$utilities, 'createIframe').returns(Promise.resolve());

      auth.profile.$accessToken = '55555-55555';

      const promise = auth.retrieveAccessToken();

      return promise.catch(error => {
        return error;
      }).then(error => {
        expect(error.code).to.equal('invalid_state');
      });
    });
  });

  describe('function($$onRouteChanged)', () => {
    it('should authenticate if the route is secure', () => {
      auth.$config.routes = true;

      sinon.stub(auth, 'retrieveAccessToken').returns(Promise.resolve());

      expect(auth.retrieveAccessToken.callCount).to.equal(0);

      auth.$$onRouteChanged();

      expect(auth.retrieveAccessToken.callCount).to.equal(1);
    });

    it('should not authenticate if the route is not secure', () => {
      auth.$config.routes = false;

      sinon.stub(auth, 'retrieveAccessToken').returns(Promise.resolve());

      expect(auth.retrieveAccessToken.callCount).to.equal(0);

      auth.$$onRouteChanged();

      expect(auth.retrieveAccessToken.callCount).to.equal(0);
    });
  });

  describe('function($$onVisibilityChanged)', () => {
    it('should refresh the token if we hide the page', () => {
      const promise = Promise.resolve();

      sinon.stub(auth, '$$refreshToken');
      sinon.stub(auth, 'refreshToken').returns(promise);
      sinon.stub(auth.profile, 'idTokenExpired').get(() => false);
      sinon.stub(auth.$utilities, '$hidden').get(() => true);

      expect(auth.refreshToken.callCount).to.equal(0);
      expect(auth.$$refreshToken.callCount).to.equal(0);

      auth.$$onVisibilityChanged();

      return promise.then(() => {
        expect(auth.refreshToken.callCount).to.equal(1);
        expect(auth.$$refreshToken.callCount).to.equal(0);
        expect(auth.$timeouts.refresh).to.equal(null);
      });
    });

    it('should reactivate the automatic refresh when the page is shown', () => {
      const promise = Promise.resolve();

      sinon.stub(auth, '$$refreshToken');
      sinon.stub(auth, 'refreshToken').returns(promise);
      sinon.stub(auth.profile, 'idTokenExpired').get(() => false);
      sinon.stub(auth.$utilities, '$hidden').get(() => false);

      expect(auth.refreshToken.callCount).to.equal(0);
      expect(auth.$$refreshToken.callCount).to.equal(0);

      auth.$$onVisibilityChanged();

      return promise.then(() => {
        expect(auth.refreshToken.callCount).to.equal(0);
        expect(auth.$$refreshToken.callCount).to.equal(1);
        expect(auth.$timeouts.refresh).to.equal(undefined);
      });
    });

    it('should bail if "autoRefresh" is false', () => {
      auth.$config.autoRefresh = false;

      sinon.stub(auth, '$$refreshToken');
      sinon.stub(auth, 'refreshToken');
      sinon.stub(auth.profile, 'idTokenExpired').get(() => false);

      expect(auth.refreshToken.callCount).to.equal(0);
      expect(auth.$$refreshToken.callCount).to.equal(0);

      auth.$$onVisibilityChanged();

      expect(auth.refreshToken.callCount).to.equal(0);
      expect(auth.$$refreshToken.callCount).to.equal(0);
    });
  });
});
