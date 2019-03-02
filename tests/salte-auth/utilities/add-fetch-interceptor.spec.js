import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';

describe('function(addFetchInterceptor)', () => {
  let utilities, windowsFetch;
  beforeEach(() => {
    windowsFetch = sinon.stub(window, 'fetch').returns(Promise.resolve());
    utilities = new SalteAuthUtilities();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should intercept Fetch requests', () => {
    const url = `${location.protocol}//${location.host}/context.html`;
    utilities.addFetchInterceptor((request) => {
      expect(request.url).to.equal(url);
      expect(request.method).to.equal('POST');
      request.headers.set('Authorization', 'test');
    });

    utilities.addFetchInterceptor((request) => {
      expect(request.headers.get('Authorization')).to.equal('test');
    });

    return fetch(url, {
      method: 'POST'
    }).then(() => {
      expect(windowsFetch.calledWith(sinon.match.instanceOf(Request))).to.equal(true);
      const [request] = windowsFetch.firstCall.args;
      expect(request.headers.has('Authorization')).to.equal(true);
    });
  });

  it('should support the Request class', () => {
    const url = `${location.protocol}//${location.host}/context.html`;
    utilities.addFetchInterceptor((request) => {
      expect(request.url).to.equal(url);
      expect(request.method).to.equal('POST');
      request.headers.set('Authorization', 'test');
    });

    utilities.addFetchInterceptor((request) => {
      expect(request.headers.get('Authorization')).to.equal('test');
    });

    return fetch(new Request(url, {
      method: 'POST'
    }));
  });

  it('should support the URL class', () => {
    const url = `${location.protocol}//${location.host}/context.html`;
    utilities.addFetchInterceptor((request) => {
      expect(request.url).to.equal(url);
      expect(request.method).to.equal('POST');
      request.headers.set('Authorization', 'test');
    });

    utilities.addFetchInterceptor((request) => {
      expect(request.headers.get('Authorization')).to.equal('test');
    });

    return fetch(new URL(url), {
      method: 'POST'
    });
  });

  it('should support fetch not being available', () => {
    window.fetch = null;

    new SalteAuthUtilities();

    expect(window.fetch).to.equal(null);
  });
});
