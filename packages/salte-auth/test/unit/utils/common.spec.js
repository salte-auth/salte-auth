import chai from 'chai';
import sinon from 'sinon';

import { Common } from '../../../src/utils/common';
import { Events } from '../../../src/utils/events';
import { getError } from '../../utils/get-error';

const { expect } = chai;

describe('Common', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('function(includes)', () => {
    it('should support arrays', () => {
      expect(Common.includes([1,2,3], 2)).to.equal(true);
    });

    it('should support strings', () => {
      expect(Common.includes('hello', 'ell')).to.equal(true);
    });
  });

  describe('function(forEach)', () => {
    it('should support arrays', () => {
      let count = 0;

      Common.forEach(Array(3), () => count++);

      expect(count).to.equal(3);
    });

    it('should support objects', () => {
      let count = 0;

      Common.forEach({
        hello: 'world',
        hallo: 'welt'
      }, (value, key) => {
        if (count === 0) {
          expect(key).to.equal('hello');
          expect(value).to.equal('world');
        } else if (count === 1) {
          expect(key).to.equal('hallo');
          expect(value).to.equal('welt');
        }

        count++
      });

      expect(count).to.equal(2);
    });
  });

  describe('function(find)', () => {
    it('should support arrays', () => {
      const match = Common.find([0,1,2], (value, index) => index === 1);

      expect(match).to.equal(1);
    });

    it('should support objects', () => {
      const match = Common.find({
        hello: 'world',
        hallo: 'welt'
      }, (value, key) => key === 'hello' && value === 'world');

      expect(match).to.equal('world');
    });
  });

  describe('function(assign)', () => {
    it('should override previous values', () => {
      const output = Common.assign({
        hello: 'world'
      }, {
        hello: 'welt',
        hallo: 'welt'
      });

      expect(output).to.deep.equal({
        hello: 'welt',
        hallo: 'welt'
      });
    });
  });

  describe('function(defaults)', () => {
    it('should support merging defaults into an existing object', () => {
      const output = Common.defaults({
        hallo: 'welt'
      }, {
        hello: 'world'
      });

      expect(output).to.deep.equal({
        hallo: 'welt',
        hello: 'world'
      });
    });

    it('should support leave keys that are already set alone', () => {
      const output = Common.defaults({
        hello: 'welt'
      }, {
        hello: 'world'
      });

      expect(output).to.deep.equal({
        hello: 'welt'
      });
    });

    it('should support multiple layers of defaults', () => {
      const output = Common.defaults({}, {
        hallo: 'welt'
      }, {
        hello: 'world'
      });

      expect(output).to.deep.equal({
        hallo: 'welt',
        hello: 'world'
      });
    });

    it('should support overriding ignoring true, when false is present', () => {
      const output = Common.defaults({
        hello: false
      }, {
        hello: true
      });

      expect(output).to.deep.equal({
        hello: false
      });
    });

    it('should support nested objects', () => {
      const output = Common.defaults({
        renewal: {
          type: 'auto'
        }
      }, {
        renewal: {
          type: 'manual',
          buffer: 60000
        }
      });

      expect(output).to.deep.equal({
        renewal: {
          type: 'auto',
          buffer: 60000
        }
      });
    });
  });

  describe('function(debounce)', () => {
    it('should support invoking a callback', () => {
      return new Promise((resolve) => {
        Common.debounce('hello', resolve, 100);
      });
    });

    it('should support overwriting a callback', () => {
      return new Promise((resolve, reject) => {
        Common.debounce('hallo', reject, 100);

        setTimeout(() => {
          Common.debounce('hallo', resolve, 100);
        }, 10);
      });
    });
  });

  describe('function(iframe)', () => {
    beforeEach(() => {
      sinon.spy(document, 'createElement');
      /**
       * IE 11 hates iframes in iframes and ignore src being changed for some reason.
       * I couldn't find any information as to why this is the case, but it seems to be.
       *
       * Doing the following in the karma options fixes this as well, but makes the tests brittle.
       * @example
       * client: {
       *   useIframe: false,
       *   runInParent: true,
       * }
       */
      sinon.stub(HTMLIFrameElement.prototype, 'contentWindow').get(function () {
        if (this.parentElement) {
          return {
            location: {
              href: this.src,
              search: '?hello=world',
              hash: '#hallo=welt'
            }
          };
        }

        return null;
      });
    });

    afterEach(() => {
      const iframe = document.createElement.firstCall.returnValue;
      iframe && iframe.parentElement && iframe.parentElement.removeChild(iframe);
    });

    it('should create a hidden iframe', () => {
      const url = `${location.protocol}//${location.host}/context.html`;
      const promise = Common.iframe({
        url,
        redirectUrl: url
      });
      const iframe = document.createElement.firstCall.returnValue;

      expect(iframe).to.not.be.undefined;
      expect(iframe.style.display).to.equal('none');

      return promise;
    });

    it('should support an iframe not matching the final url', () => {
      const url = `${location.protocol}//${location.host}/context.html`;
      const promise = Common.iframe({
        url: 'https://google.com',
        redirectUrl: url
      });
      const iframe = document.createElement.firstCall.returnValue;

      expect(iframe).to.not.be.undefined;
      expect(iframe.style.display).to.equal('none');

      setTimeout(() => {
        iframe.src = url;
      }, 100);

      return promise;
    });

    it('should support showing the iframe', () => {
      const url = `${location.protocol}//${location.host}/context.html`;
      const promise = Common.iframe({
        url,
        redirectUrl: url,
        visible: true
      });
      const iframe = document.createElement.firstCall.returnValue;

      expect(iframe).to.not.be.undefined;
      expect(iframe.style.display).to.equal('');

      return promise;
    });

    it('should support errors', async () => {
      const promise = Common.iframe({
        url: 'https://google.com'
      });
      const iframe = document.createElement.firstCall.returnValue;
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);

      expect(await getError(promise)).instanceOf(Error);
    });

    it('should ignore CrossDomainErrors', async () => {
      sinon.stub(Events, 'isCrossDomainError').returns(true);

      const promise = Common.iframe({
        url: location.href,
        redirectUrl: location.href
      });
      const iframe = document.createElement.firstCall.returnValue;
      sinon.stub(iframe.parentElement, 'removeChild').callsFake(() => {
        throw Error('test');
      });

      setTimeout(() => {
        Events.isCrossDomainError.restore();
        iframe.parentElement.removeChild.restore();
      }, 200);

      return promise;
    });
  });
});
