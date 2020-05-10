import chai from 'chai';
import chaiSinon from 'chai-sinon';
import sinon from 'sinon';

import { SalteAuth, Utils, Handler } from '../../src/salte-auth';
import { OpenID } from '../../src/generic';
import { getError } from '../utils/get-error';

const { expect } = chai;
chai.use(chaiSinon);

describe('SalteAuth', () => {
  /** @type {SalteAuth} */
  let auth;
  /** @type {OpenID} */
  let openid;

  let routeCallbacks, fetchInterceptors, xhrInterceptors, clock;
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    clock = sinon.useFakeTimers(1000);
    routeCallbacks = [];
    fetchInterceptors = [];
    xhrInterceptors = [];
    sinon.stub(Utils.Events, 'route').callsFake((routeCallback) => {
      routeCallbacks.push(routeCallback);
    });
    sinon.stub(Utils.Interceptors.Fetch, 'add').callsFake((interceptor) => {
      fetchInterceptors.push(interceptor);
    });
    sinon.stub(Utils.Interceptors.XHR, 'add').callsFake((interceptor) => {
      xhrInterceptors.push(interceptor);
    });

    openid = new OpenID({
      clientID: '12345',
      routes: true,
      endpoints: [
        'https://google.com'
      ],

      login() {
        return 'https://google.com/login';
      },

      logout() {
        return 'https://google.com/logout';
      }
    });

    class BasicHandler extends Handler {
      get auto() {
        return true;
      }

      get name() {
        return 'basic';
      }
    }

    auth = new SalteAuth({
      providers: [openid],

      handlers: [
        new BasicHandler({ default: true })
      ]
    });
  });

  afterEach(() => {
    clock.restore();
    sinon.restore();
  });

  describe('constructor', () => {
    beforeEach(() => {
      clock.restore();
      sinon.reset();
    });

    it('should register various listeners', async () => {
      class Custom extends Handler {
        get name() {
          return 'custom';
        }
      }

      const custom = new Custom({ default: true });

      custom.connected = sinon.stub();
      sinon.stub(openid, 'connected');
      sinon.stub(openid, 'on');

      new SalteAuth({
        providers: [openid],

        handlers: [custom]
      });

      await new Promise((resolve) => setTimeout(resolve));

      expect(custom.connected.callCount).to.equal(1);
      expect(custom.connected).calledWith({
        action: null
      });
      expect(openid.connected.callCount).to.equal(1);
      expect(openid.on.callCount).to.equal(2);
      expect(Utils.Interceptors.Fetch.add.callCount).to.equal(1);
      expect(Utils.Interceptors.XHR.add.callCount).to.equal(1);
      expect(Utils.Events.route.callCount).to.equal(1);
    });

    it('should support authentication wrap up for "login" on "connected"', async () => {
      class Custom extends Handler {
        get name() {
          return 'custom';
        }

        connected({ action }) {
          expect(action).to.equal('login');

          return { state: 'hello-world' };
        }
      }

      const custom = new Custom({ default: true });

      sinon.stub(openid, 'validate');
      sinon.stub(Utils.StorageHelpers.CookieStorage.prototype, 'get').callsFake((key) => {
        switch (key) {
          case 'action': return 'login';
          case 'handler': return 'custom';
          case 'provider': return 'generic.openid';
          default: throw new Error(`Unknown key. (${key})`);
        }
      });

      auth = new SalteAuth({
        providers: [openid],

        handlers: [custom]
      });

      await new Promise((resolve) => setTimeout(resolve));

      expect(openid.validate.callCount).to.equal(1);
      expect(openid.validate).to.be.calledWith({
        state: 'hello-world'
      });
    });

    it('should prevent logging in while wrapping up authentication for "login"', async () => {
      class Custom extends Handler {
        get name() {
          return 'custom';
        }

        connected({ action }) {
          expect(action).to.equal('login');

          return { state: 'hello-world' };
        }
      }

      const custom = new Custom({ default: true });

      sinon.stub(openid, 'validate');
      sinon.stub(Utils.StorageHelpers.CookieStorage.prototype, 'get').callsFake((key) => {
        switch (key) {
          case 'action': return 'login';
          case 'handler': return 'custom';
          case 'provider': return 'generic.openid';
          default: throw new Error(`Unknown key. (${key})`);
        }
      });

      auth = new SalteAuth({
        providers: [openid],

        handlers: [custom]
      });

      await auth.login(openid.$name);

      await new Promise((resolve) => setTimeout(resolve));

      expect(openid.validate.callCount).to.equal(1);
      expect(openid.validate).to.be.calledWith({
        state: 'hello-world'
      });
    });

    it('should support authentication wrap up for "logout" on "connected"', async () => {
      class Custom extends Handler {
        get name() {
          return 'custom';
        }

        connected({ action }) {
          expect(action).to.equal('logout');
        }
      }

      const custom = new Custom({ default: true });

      sinon.spy(openid.storage, 'clear');
      sinon.stub(openid, 'sync');
      sinon.stub(Utils.StorageHelpers.CookieStorage.prototype, 'get').callsFake((key) => {
        switch (key) {
          case 'action': return 'logout';
          case 'handler': return 'custom';
          case 'provider': return 'generic.openid';
          default: throw new Error(`Unknown key. (${key})`);
        }
      });

      new SalteAuth({
        providers: [openid],

        handlers: [custom]
      });

      await new Promise((resolve) => setTimeout(resolve));

      expect(openid.storage.clear.callCount).to.equal(1);
      expect(openid.sync.callCount).to.equal(1);
    });

    it('should prevent logging out while wrapping up authentication for "logout"', async () => {
      class Custom extends Handler {
        get name() {
          return 'custom';
        }

        connected({ action }) {
          expect(action).to.equal('logout');
        }
      }

      const custom = new Custom({ default: true });

      sinon.spy(openid.storage, 'clear');
      sinon.stub(openid, 'sync');
      sinon.stub(Utils.StorageHelpers.CookieStorage.prototype, 'get').callsFake((key) => {
        switch (key) {
          case 'action': return 'logout';
          case 'handler': return 'custom';
          case 'provider': return 'generic.openid';
          default: throw new Error(`Unknown key. (${key})`);
        }
      });

      auth = new SalteAuth({
        providers: [openid],

        handlers: [custom]
      });

      await auth.logout(openid.$name);

      await new Promise((resolve) => setTimeout(resolve));

      expect(openid.storage.clear.callCount).to.equal(1);
      expect(openid.sync.callCount).to.equal(1);
    });

    it('should throw an error on authentication wrap up if the action is unknown', () => {
      class Custom extends Handler {
        get name() {
          return 'custom';
        }

        connected({ action }) {
          expect(action).to.equal('hello');
        }
      }

      const custom = new Custom({ default: true });

      sinon.stub(Utils.StorageHelpers.CookieStorage.prototype, 'get').callsFake((key) => {
        switch (key) {
          case 'action': return 'hello';
          case 'handler': return 'custom';
          case 'provider': return 'generic.openid';
          default: throw new Error(`Unknown key. (${key})`);
        }
      });

      const error = getError(() => new SalteAuth({
        providers: [openid],

        handlers: [custom]
      }));

      expect(error.code).to.equal('unknown_action');
    });
  });

  describe('events(login)', () => {
    it('should forward provider login events', () => {
      const expectedData = { hello: 'world' };
      return new Promise((resolve) => {
        auth.on('login', (error, data) => {
          expect(error).equals(undefined);
          expect(data).deep.equals({
            provider: 'generic.openid',
            data: expectedData
          })
          resolve();
        });

        openid.emit('login', undefined, expectedData);
      });
    });
  });

  describe('events(logout)', () => {
    it('should forward provider logout events', () => {
      return new Promise((resolve) => {
        auth.on('logout', (error, data) => {
          expect(error).equals(undefined);
          expect(data).deep.equals({
            provider: 'generic.openid'
          });
          resolve();
        });

        openid.emit('logout');
      });
    });
  });

  describe('events(route)', () => {
    beforeEach(() => {
      sinon.stub(auth, '$secure');
    });

    it(`should attempt to automatically log us in`, async () => {
      await routeCallbacks[0]();

      expect(auth.$secure.callCount).to.equal(1);
    });

    it(`should skip automatic login if the provider isn't secured`, async () => {
      openid.config.routes = false;

      await routeCallbacks[0]();

      expect(auth.$secure.callCount).to.equal(0);
    });
  });

  describe('interceptor(fetch)', () => {
    beforeEach(() => {
      sinon.stub(auth, '$secure');
    });

    it(`should attempt to automatically log us in`, async () => {
      openid.config.endpoints = ['https://google.com'];
      const expectedRequest = {
        url: 'https://google.com/hello/world'
      };

      await fetchInterceptors[0](expectedRequest);

      sinon.assert.callCount(auth.$secure, 1);
      sinon.assert.calledWith(auth.$secure, openid, expectedRequest);
    });

    it(`should skip automatic login if the provider isn't secured`, async () => {
      openid.config.endpoints = [];

      await fetchInterceptors[0]({
        url: 'https://google.com/hello/world'
      });

      sinon.assert.callCount(auth.$secure, 0);
    });
  });

  describe('interceptor(xhr)', () => {
    beforeEach(() => {
      sinon.stub(auth, '$secure');
    });

    it(`should attempt to automatically log us in`, async () => {
      openid.config.endpoints = ['https://google.com'];
      const expectedRequest = {
        $url: 'https://google.com/hello/world'
      };

      await xhrInterceptors[0](expectedRequest);

      sinon.assert.callCount(auth.$secure, 1);
      sinon.assert.calledWith(auth.$secure, openid, expectedRequest);
    });

    it(`should skip automatic login if the provider isn't secured`, async () => {
      openid.config.endpoints = [];

      await xhrInterceptors[0]({
        $url: 'https://google.com/hello/world'
      });

      sinon.assert.callCount(auth.$secure, 0);
    });
  });

  describe('function(login)', () => {
    it('should support providing only a provider name', async () => {
      class Custom extends Handler {
        get name() {
          return 'custom';
        }
      }

      Custom.prototype.open = sinon.stub().returns(Promise.resolve({
        state: '12345'
      }));

      sinon.stub(openid, 'validate');

      const auth = new SalteAuth({
        providers: [openid],

        handlers: [
          new Custom({ default: true })
        ]
      });

      await auth.login('generic.openid');

      expect(auth.handler('custom').open.callCount).to.equal(1);

      const [options] = auth.handler('custom').open.firstCall.args;
      expect(options.url).to.match(/^https:\/\/google.com\/login\?/);
      expect(options.redirectUrl).to.equal(location.origin);

      expect(openid.validate.callCount).to.equal(1);
      expect(openid.validate).to.be.calledWith({
        state: '12345'
      });
    });

    it('should support providing a set of options', async () => {
      class Custom extends Handler {
        get name() {
          return 'custom';
        }
      }

      Custom.prototype.open = sinon.stub().returns(Promise.resolve({
        state: '12345'
      }));

      sinon.stub(openid, 'validate');

      const auth = new SalteAuth({
        providers: [openid],

        handlers: [
          new Custom({ default: true })
        ]
      });

      await auth.login({
        provider: 'generic.openid',
        handler: 'custom'
      });

      expect(auth.handler('custom').open.callCount).to.equal(1);

      const [options] = auth.handler('custom').open.firstCall.args;
      expect(options.url).to.match(/^https:\/\/google.com\/login\?/);
      expect(options.redirectUrl).to.equal(location.origin);

      expect(openid.validate.callCount).to.equal(1);
      expect(openid.validate).to.be.calledWith({
        state: '12345'
      });
    });
  });

  describe('function(logout)', () => {
    it('should support providing only a provider name', async () => {
      class Custom extends Handler {
        get name() {
          return 'custom';
        }
      }

      Custom.prototype.open = sinon.stub().returns(Promise.resolve({
        state: '12345'
      }));

      sinon.stub(openid, 'validate');
      sinon.stub(openid, 'sync');

      const auth = new SalteAuth({
        providers: [openid],

        handlers: [
          new Custom({ default: true })
        ]
      });

      await auth.logout('generic.openid');

      expect(auth.handler('custom').open.callCount).to.equal(1);

      const [options] = auth.handler('custom').open.firstCall.args;
      expect(options.url).to.equal('https://google.com/logout');
      expect(options.redirectUrl).to.equal(location.origin);

      sinon.assert.calledOnce(openid.sync);
    });

    it('should support providing a set of options', async () => {
      class Custom extends Handler {
        get name() {
          return 'custom';
        }
      }

      Custom.prototype.open = sinon.stub().returns(Promise.resolve({
        state: '12345'
      }));

      sinon.stub(openid, 'validate');

      const auth = new SalteAuth({
        providers: [openid],

        handlers: [
          new Custom({ default: true })
        ]
      });

      await auth.logout({
        provider: 'generic.openid',
        handler: 'custom'
      });

      expect(auth.handler('custom').open.callCount).to.equal(1);

      const [options] = auth.handler('custom').open.firstCall.args;
      expect(options.url).to.equal('https://google.com/logout');
      expect(options.redirectUrl).to.equal(location.origin);
    });

    it('should support extra query parameters', async () => {
      openid = new OpenID({
        clientID: '12345',
        routes: true,
        endpoints: [
          'https://google.com'
        ],

        login() {
          return 'https://google.com/login';
        },

        logout() {
          return 'https://google.com/logout';
        },

        queryParams: (type) => type === 'logout' ? { hello: 'world' } : null,
      });

      class Custom extends Handler {
        get name() {
          return 'custom';
        }
      }

      Custom.prototype.open = sinon.stub().returns(Promise.resolve({
        state: '12345'
      }));

      sinon.stub(openid, 'validate');
      sinon.stub(openid, 'sync');

      const auth = new SalteAuth({
        providers: [openid],

        handlers: [
          new Custom({ default: true })
        ]
      });

      await auth.logout('generic.openid');

      expect(auth.handler('custom').open.callCount).to.equal(1);

      const [options] = auth.handler('custom').open.firstCall.args;
      expect(options.url).to.equal('https://google.com/logout?hello=world');
      expect(options.redirectUrl).to.equal(location.origin);

      sinon.assert.calledOnce(openid.sync);
    });

    it('should support throwing errors', async () => {
      class Custom extends Handler {
        get name() {
          return 'custom';
        }
      }

      Custom.prototype.open = sinon.stub().returns(Promise.reject(new Error('Whoops!')));

      sinon.stub(openid, 'validate');

      const auth = new SalteAuth({
        providers: [openid],

        handlers: [
          new Custom({ default: true })
        ]
      });

      return new Promise(async (resolve) => {
        auth.on('logout', (error) => {
          expect(error.message).to.equal('Whoops!');
          resolve();
        });

        const error = await getError(auth.logout('generic.openid'));

        expect(error.message).to.equal('Whoops!');
      });
    });
  });

  describe('function(provider)', () => {
    it('should return a provider with the given name', () => {
      expect(auth.provider('generic.openid')).to.be.instanceOf(OpenID);
    });

    it(`should throw an error if we can't find a provider with the given name`, () => {
      const error = getError(() => auth.provider('hello'));

      expect(error.code).to.equal('invalid_provider');
    });
  });

  describe('function(handler)', () => {
    it('should return a handler with the given name', () => {
      expect(auth.handler('basic')).to.be.instanceOf(Handler);
    });

    it(`should return the default handler if a name isn't provided`, () => {
      expect(auth.handler()).to.be.instanceOf(Handler);
    });

    it(`should throw an error if we can't find a handler with the given name`, () => {
      const error = getError(() => auth.handler('hello'));

      expect(error.code).to.equal('invalid_handler');
    });
  });

  describe('function($secure)', () => {
    it('should repeat until "secure" resolves to true', async () => {
      sinon.stub(auth, 'login');
      sinon.stub(openid, 'secure').onCall(0).resolves(false).resolves(true);

      await auth.$secure(openid);

      sinon.assert.callCount(auth.login, 0);
      sinon.assert.callCount(openid.secure, 2);
    });

    it('should initiate a login if one is requested', async () => {
      sinon.stub(auth, 'login');
      sinon.stub(openid, 'secure').onCall(0).resolves('login').resolves(true);

      await auth.$secure(openid);

      sinon.assert.callCount(auth.login, 1);
      sinon.assert.callCount(openid.secure, 2);
    });

    it('should throw an error if the default handler does not support automatic authentication', async () => {
      sinon.stub(auth.handler(), 'auto').get(() => false);
      sinon.stub(auth, 'login');
      sinon.stub(openid, 'secure').onCall(0).resolves('login').resolves(true);

      try {
        await auth.$secure(openid);

        expect.fail('Expected an error to be thrown.');
      } catch (error) {
        expect(error.code).equals('auto_unsupported');

        sinon.assert.callCount(auth.login, 0);
        sinon.assert.callCount(openid.secure, 1);
      }
    });
  });
});
