import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';

describe('function(addFetchInterceptor)', () => {
  let sandbox, utilities;
  beforeEach(() => {
    utilities = new SalteAuthUtilities();
    sandbox = sinon.createSandbox();
    sandbox.stub(window, 'fetch');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should intercept Fetch requests', () => {
    const url = `${location.protocol}//${location.host}/context.html`;
    utilities.addFetchInterceptor((input, options) => {
      expect(input).to.equal(url);
      expect(options).to.deep.equal({
        method: 'POST'
      });
    });

    return fetch(url, {
      method: 'POST'
    });
  });

  it('should default the options if none are provided', () => {
    const url = `${location.protocol}//${location.host}/context.html`;
    utilities.addFetchInterceptor((input, options) => {
      expect(input).to.equal(url);
      expect(options).to.deep.equal({});
    });

    return fetch(url);
  });

  it('should support fetch not being available', () => {
    window.fetch = null;

    new SalteAuthUtilities();

    expect(window.fetch).to.equal(null);
  });
});
