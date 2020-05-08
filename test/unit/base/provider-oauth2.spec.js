import chai from 'chai';
import chaiString from 'chai-string';
import sinon from 'sinon';

import { OAuth2Provider } from '../../../src/base/provider-oauth2';

import { getParams } from '../../utils/get-params';
import { getError } from '../../utils/get-error';

const { expect } = chai;
chai.use(chaiString);

describe('OAuth2Provider', () => {
  let clock;
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    clock = sinon.useFakeTimers(1000000);
  });

  afterEach(() => {
    clock.restore();
  });

  describe('function(connected)', () => {
    it(`should require that responseType is defined`, () => {
      class Example extends OAuth2Provider {
        constructor(config) {
          super(config);
        }
      };

      const example = new Example();

      expect(() => example.connected()).to.throw(Error);
    });
  });

  describe('function(secure)', () => {
    it('should support enhancing a Request with the Access Token', async () => {
      class Example extends OAuth2Provider {};

      const example = new Example({
        responseType: 'token'
      });

      example.storage.set('access-token.raw', '12345');
      example.storage.set('access-token.expiration', Date.now() + 1);
      example.sync();

      const request = new Request('https://google.com');

      expect(await example.secure(request)).to.equal(true);
      expect(request.headers.get('Authorization')).to.equal('Bearer 12345');
    });

    it('should support enhancing a XMLHttpRequest with the Access Token', async () => {
      class Example extends OAuth2Provider {};
      const example = new Example({
        responseType: 'token'
      });

      example.storage.set('access-token.raw', '12345');
      example.storage.set('access-token.expiration', Date.now() + 1);
      example.sync();

      const request = new XMLHttpRequest();
      sinon.stub(request, 'setRequestHeader');

      expect(await example.secure(request)).to.equal(true);
      expect(request.setRequestHeader.firstCall.args).to.deep.equal(['Authorization', 'Bearer 12345']);
    });

    it('should ignore requests about Authorization Codes', async () => {
      class Example extends OAuth2Provider {};

      const example = new Example({
        responseType: 'code'
      });

      const request = new Request('https://google.com');

      expect(await example.secure(request)).to.equal(true);
      expect(request.headers.get('Authorization')).to.equal(null);
    });

    it('should support securing without a request', async () => {
      class Example extends OAuth2Provider {};

      const example = new Example({
        responseType: 'token'
      });

      example.storage.set('access-token.raw', '12345');
      example.storage.set('access-token.expiration', Date.now() + 1);
      example.sync();

      expect(await example.secure()).to.equal(true);
    });

    it(`should return a url if we need to login`, async () => {
      class Example extends OAuth2Provider {
        get name() {
          return 'example';
        }

        get login() {
          return 'https://google.com';
        }
      };

      const example = new Example({
        clientID: '12345',
        responseType: 'token',
        scope: 'hello'
      });

      expect(await example.secure()).startsWith(`${example.url('https://google.com', {
        client_id: '12345',
        response_type: 'token',
        redirect_uri: location.origin,
        scope: 'hello'
      })}&state=example-state-`);
    });

    it('should throw an error on unknown request types', async () => {
      class Example extends OAuth2Provider {};

      const example = new Example({
        clientID: '<client-id>',
        responseType: 'token'
      });

      example.storage.set('access-token.raw', '12345');
      example.storage.set('access-token.expiration', Date.now() + 1);
      example.sync();

      const error = await example.secure(new Error()).catch((error) => error);

      expect(error.code).to.equal('unknown_request');
    });
  });

  describe('function($validate)', () => {
    it('should support validating Access Tokens', () => {
      class Example extends OAuth2Provider {};

      const example = new Example();

      example.storage.set('state', '12345');
      example.storage.set('response-type', 'token');

      return new Promise((resolve) => {
        example.on('login', (error, accessToken) => {
          expect(error).to.equal(null);
          expect(accessToken.raw).to.equal('hello');
          expect(accessToken.type).to.equal('bearer');
          expect(accessToken.expiration).to.equal(2000000);
          expect(example.code).to.equal(null);
          resolve();
        });

        example.validate({
          state: '12345',
          access_token: 'hello',
          token_type: 'bearer',
          expires_in: 1000
        });
      });
    });

    it('should support validating Authorization Codes', () => {
      class Example extends OAuth2Provider {};

      const example = new Example();

      example.storage.set('state', '12345');
      example.storage.set('response-type', 'code');

      return new Promise((resolve) => {
        example.on('login', (error, code) => {
          expect(error).to.equal(null);
          expect(code).to.equal('hello');

          expect(example.accessToken.type).to.equal(null);
          expect(example.accessToken.expiration).to.equal(null);
          expect(example.accessToken.raw).to.equal(null);
          resolve();
        });

        example.validate({
          state: '12345',
          code: 'hello',
          token_type: 'bearer',
          expires_in: 1000
        });
      });
    });

    it('should support provider errors', async () => {
      class Example extends OAuth2Provider {};

      const example = new Example();

      example.storage.set('response-type', 'token');

      const error = getError(() => example.validate({
        error: 'hello_world'
      }));

      expect(error.code).to.equal('hello_world');
      expect(error.message).to.equal('hello_world');
    });

    it('should support provider errors with a custom description', async () => {
      class Example extends OAuth2Provider {};

      const example = new Example();

      example.storage.set('response-type', 'token');

      const error = getError(() => example.validate({
        error: 'hello_world',
        error_description: 'Hello World'
      }));

      expect(error.code).to.equal('hello_world');
      expect(error.message).to.equal('Hello World');
    });

    it('should support provider errors with a custom description and uri', async () => {
      class Example extends OAuth2Provider {};

      const example = new Example();

      example.storage.set('response-type', 'token');

      const error = getError(() => example.validate({
        error: 'hello_world',
        error_description: 'Hello World',
        error_uri: 'https://google.com'
      }));

      expect(error.code).to.equal('hello_world');
      expect(error.message).to.equal('Hello World (https://google.com)');
    });

    it('should support validating the state', async () => {
      class Example extends OAuth2Provider {};

      const example = new Example();

      example.storage.set('state', '54321');
      example.storage.set('response-type', 'token');

      const error = getError(() => example.validate({
        state: '12345'
      }));

      expect(error.code).to.equal('invalid_state');
    });

    it('should support invalid Authorization Codes', async () => {
      class Example extends OAuth2Provider {};

      const example = new Example({
        responseType: 'token'
      });

      example.storage.set('state', '12345');
      example.storage.set('response-type', 'code');

      const error = getError(() => example.validate({
        state: '12345'
      }));

      expect(error.code).to.equal('invalid_code');
    });

    it('should support invalid Access Tokens', async () => {
      class Example extends OAuth2Provider {};

      const example = new Example({
        responseType: 'token'
      });

      example.storage.set('state', '12345');
      example.storage.set('response-type', 'token');

      const error = getError(() => example.validate({
        state: '12345'
      }));

      expect(error.code).to.equal('invalid_access_token');
    });

    it('should support validation being disabled', () => {
      class Example extends OAuth2Provider {};

      const example = new Example({
        validation: false
      });

      example.storage.set('state', '54321');
      example.storage.set('response-type', 'token');

      return new Promise((resolve) => {
        example.on('login', (error, accessToken) => {
          expect(error).to.equal(null);
          expect(accessToken.raw).to.equal('hello');
          resolve();
        });

        example.validate({
          state: '12345',
          access_token: 'hello'
        });
      });
    });

    it('should throw an error if an empty response is provided', async () => {
      class Example extends OAuth2Provider {};

      const example = new Example();

      example.storage.set('response-type', 'token');

      const error = getError(() => example.validate());

      expect(error.code).to.equal('empty_response');
    });
  });

  describe('function($login)', () => {
    it(`should construct a login url`, () => {
      class Example extends OAuth2Provider {
        get name() {
          return 'example';
        }

        get login() {
          return 'https://google.com';
        }
      };

      const example = new Example({
        clientID: '12345',
        responseType: 'token',
        scope: 'hello'
      });

      const params = getParams(example.$login());

      expect(params.client_id).to.equal('12345');
      expect(params.response_type).to.equal('token');
      expect(params.redirect_uri).to.equal(encodeURIComponent(location.origin));
      expect(params.scope).to.equal('hello');
      expect(params.state).to.match(/^example-state-.+/);
    });

    it('should support providing overrides', () => {
      class Example extends OAuth2Provider {
        get name() {
          return 'example';
        }

        get login() {
          return 'https://google.com';
        }
      };

      const example = new Example({
        clientID: '12345',
        responseType: 'token',
        scope: 'hello'
      });

      const params = getParams(example.$login({
        responseType: 'code'
      }));

      expect(params.client_id).to.equal('12345');
      expect(params.response_type).to.equal('code');
      expect(params.redirect_uri).to.equal(encodeURIComponent(location.origin));
      expect(params.scope).to.equal('hello');
      expect(params.state).to.match(/^example-state-.+/);
    });

    it('should support providing extra parameters', () => {
      class Example extends OAuth2Provider {
        get name() {
          return 'example';
        }

        get login() {
          return 'https://google.com';
        }
      };

      const example = new Example({
        clientID: '12345',
        responseType: 'token',
        scope: 'hello',

        queryParams: (type) => type === 'login' ? { hello: 'world' } : null,
      });

      const params = getParams(example.$login());

      expect(params.hello).to.equal('world');
    });
  });

  describe('function(logout)', () => {
    it(`should throw an error`, () => {
      class Example extends OAuth2Provider {};

      const example = new Example({
        responseType: 'token'
      });

      const error = getError(() => example.logout());

      expect(error.code).to.equal('logout_not_supported');
    });
  });
});
