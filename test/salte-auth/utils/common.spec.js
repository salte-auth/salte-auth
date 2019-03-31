import chai from 'chai';
import sinon from 'sinon';

import { Common } from '../../../src/utils/common';
import { getError } from '../../utils/get-error';

const { expect } = chai;

describe('Common', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('function(forEach)', () => {
    it('should loop over an array', () => {
      let count = 0;

      Common.forEach(Array(3), () => count++);

      expect(count).to.equal(3);
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
      /* In the event of a timeout we need to clean up the iframe */
      const iframe = document.body.querySelector('iframe[owner="@salte-auth/salte-auth"]');
      iframe && iframe.parentElement && iframe.parentElement.removeChild(iframe);
    });

    it('should create a hidden iframe', () => {
      const url = `${location.protocol}//${location.host}/context.html`;
      const promise = Common.iframe({
        url,
        redirectUrl: url
      });
      const iframe = document.body.querySelector('iframe[owner="@salte-auth/salte-auth"]');

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
      const iframe = document.body.querySelector('iframe[owner="@salte-auth/salte-auth"]');

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
      const iframe = document.body.querySelector('iframe[owner="@salte-auth/salte-auth"]');

      expect(iframe).to.not.be.undefined;
      expect(iframe.style.display).to.equal('');

      return promise;
    });

    it('should support errors', async () => {
      const promise = Common.iframe({
        url: 'https://google.com'
      });
      const iframe = document.body.querySelector('iframe[owner="@salte-auth/salte-auth"]');
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);

      expect(await getError(promise)).instanceOf(Error);
    });
  });
});
