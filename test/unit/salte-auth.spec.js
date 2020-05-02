import chai from 'chai';
import chaiSinon from 'chai-sinon';
import sinon from 'sinon';

import { SalteAuth, Utils, Handler } from '../../src/salte-auth';
import { OpenID } from '../../src/generic';
import { getError } from '../utils/get-error';
import { ignoreError } from '../utils/ignore-error';

const { expect } = chai;
chai.use(chaiSinon);

describe('SalteAuth', () => {
  /** @type {SalteAuth} */
  let auth;
  /** @type {OpenID} */
  let openid;

  let routeCallbacks, clock;
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    clock = sinon.useFakeTimers(1000);
    routeCallbacks = [];
    sinon.stub(Utils.Events, 'route').callsFake((routeCallback) => {
      routeCallbacks.push(routeCallback);
    });
    Utils.Interceptors.Fetch.setup(true);
    Utils.Interceptors.XHR.setup(true);

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
      sinon.stub(Utils.Interceptors.Fetch, 'add');
      sinon.stub(Utils.Interceptors.XHR, 'add');

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
      sinon.stub(Utils.Interceptors.Fetch, 'add');
      sinon.stub(Utils.Interceptors.XHR, 'add');

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

      new SalteAuth({
        providers: [openid],

        handlers: [custom]
      });

      await new Promise((resolve) => setTimeout(resolve));

      expect(openid.validate.callCount).to.equal(1);
      expect(openid.validate).to.be.calledWith({
        state: 'hello-world'
      });
    });

    it('should support authentication wrap up for "logout" on "connected"', async () => {
      sinon.stub(Utils.Interceptors.Fetch, 'add');
      sinon.stub(Utils.Interceptors.XHR, 'add');

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

    it('should throw an error on authentication wrap up if the action is unknown', () => {
      sinon.stub(Utils.Interceptors.Fetch, 'add');
      sinon.stub(Utils.Interceptors.XHR, 'add');

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
    it(`should attempt to automatically log us in`, async () => {
      // TODO: Clean this up...
      const handler = auth.handler();
      handler.auto = true;
      handler.open = sinon.stub().returns(Promise.resolve());

      let count = 0;
      sinon.stub(openid, 'secure').callsFake(async () => {
        count++;
        if (count === 1) {
          return 'https://google.com';
        } else {
          return true;
        }
      });
      sinon.stub(openid, 'validate');

      await routeCallbacks[0]();

      expect(openid.secure.callCount).to.equal(2);
      expect(openid.validate.callCount).to.equal(1);
      expect(handler.open.callCount).to.equal(1);
    });

    it(`should skip if we're already logged in`, async () => {
      sinon.stub(openid, 'secure').returns(Promise.resolve(true));
      sinon.stub(openid, 'validate');

      await routeCallbacks[0]();

      expect(openid.validate.callCount).to.equal(0);
    });

    it(`should skip automatic login if the handler doesn't support it`, async () => {
      sinon.stub(openid, 'validate');

      expect(routeCallbacks.length).to.equal(1);

      const error = await getError(routeCallbacks[0]());

      expect(error.code).to.equal('auto_unsupported');
      expect(openid.validate.callCount).to.equal(0);
    });

    it(`should skip automatic login if the provider isn't secured`, async () => {
      openid.config.routes = false;

      await routeCallbacks[0]();
    });
  });

  describe('interceptor(fetch)', () => {
    it('should enhance fetch requests', async () => {
      openid.storage.set('response-type', 'id_token');
      openid.storage.set('id-token.raw', `0.${btoa(
        JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          exp: Date.now() + 99999
        })
      )}.0`);
      openid.storage.set('access-token.raw', '12345');
      openid.storage.set('access-token.expiration', 99999);
      openid.sync();

      const promise = new Promise((resolve) => {
        Utils.Interceptors.Fetch.add((request) => {
          expect(request.headers.get('Authorization')).to.equal('Bearer 12345');
          resolve();
        })
      });

      await Promise.all([promise, ignoreError(fetch('https://google.com'))]);
    });

    it(`should skip if a provider isn't secured`, async () => {
      openid.config.endpoints = [];

      const promise = new Promise((resolve) => {
        Utils.Interceptors.Fetch.add((request) => {
          expect(request.headers.get('Authorization')).to.equal(null);
          resolve();
        })
      });

      await Promise.all([promise, ignoreError(fetch('https://google.com'))]);
    });
  });

  describe('interceptor(xhr)', () => {
    it('should enhance XHR requests', async () => {
      sinon.stub(openid, 'secure');

      await new Promise((resolve) => {
        const request = new XMLHttpRequest();

        request.addEventListener('load', resolve, { passive: true });
        request.addEventListener('error', resolve, { passive: true });

        request.open('GET', 'https://google.com', false);
        request.send();
      });

      expect(openid.secure.callCount).to.equal(1);
    });

    it(`should skip if a provider isn't secured`, async () => {
      openid.config.endpoints = [];
      sinon.stub(openid, 'secure');

      await new Promise((resolve) => {
        const request = new XMLHttpRequest();

        request.addEventListener('load', resolve, { passive: true });
        request.addEventListener('error', resolve, { passive: true });

        request.open('GET', 'https://google.com', false);
        request.send();
      });

      expect(openid.secure.callCount).to.equal(0);
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
});
