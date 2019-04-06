import chai from 'chai';
import chaiSinon from 'chai-sinon';
import sinon from 'sinon';

import { Fetch } from '../../../../src/utils/interceptors/fetch';

const { expect } = chai;
chai.use(chaiSinon);

describe('Fetch', () => {
  beforeEach(() => {
    Fetch.setup(true);
    sinon.stub(Fetch, 'real').returns(Promise.resolve());
  });

  afterEach(() => {
    sinon.restore();
    window.fetch = Fetch.real;
  });

  describe('function(setup)', () => {
    it('should support fetch not being available', () => {
      window.fetch = null;

      Fetch.setup(true);

      expect(window.fetch).to.equal(null);
    });
  });

  describe('function(add)', () => {
    it('should intercept fetch requests', async () => {
      const url = `${location.protocol}//${location.host}/context.html`;
      Fetch.add((request) => {
        expect(request.url).to.equal(url);
        expect(request.method).to.equal('POST');
        request.headers.set('Authorization', 'test');
      });

      Fetch.add((request) => {
        expect(request.headers.get('Authorization')).to.equal('test');
      });

      await fetch(url, {
        method: 'POST'
      });

      expect(Fetch.real.callCount).to.equal(1);
      const [request] = Fetch.real.firstCall.args;
      expect(request).to.be.instanceOf(Request);
      expect(request.headers.has('Authorization')).to.equal(true);
    });

    it('should support the Request class', () => {
      const url = `${location.protocol}//${location.host}/context.html`;
      Fetch.add((request) => {
        expect(request.url).to.equal(url);
        expect(request.method).to.equal('POST');
        request.headers.set('Authorization', 'test');
      });

      Fetch.add((request) => {
        expect(request.headers.get('Authorization')).to.equal('test');
      });

      return fetch(new Request(url, {
        method: 'POST'
      }));
    });

    it('should support the URL class', () => {
      const url = `${location.protocol}//${location.host}/context.html`;
      Fetch.add((request) => {
        expect(request.url).to.equal(url);
        expect(request.method).to.equal('POST');
        request.headers.set('Authorization', 'test');
      });

      Fetch.add((request) => {
        expect(request.headers.get('Authorization')).to.equal('test');
      });

      return fetch(new URL(url), {
        method: 'POST'
      });
    });
  });
});
