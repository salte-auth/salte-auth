import { expect } from 'chai';

import { SalteAuthUtilities } from '../../src/salte-auth.utilities.js';

describe('salte-auth.utilities', () => {
  let sandbox, utilities;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    utilities = new SalteAuthUtilities();
  });

  afterEach(() => {
    sandbox.restore();
    delete window.salte.SalteAuthUtilities.$instance;
  });

  describe('function(constructor)', () => {
    it('should be a singleton', () => {
      utilities.bogus = 'test';
      expect(utilities.bogus).to.equal('test');
      expect(new SalteAuthUtilities().bogus).to.equal('test');
    });

    it('should recreate the path to the instance', () => {
      utilities.bogus = 'test';
      expect(utilities.bogus).to.equal('test');

      delete window.salte.SalteAuthUtilities.$instance;

      utilities = new SalteAuthUtilities();

      expect(utilities.bogus).to.be.undefined;
      expect(window.salte.SalteAuthUtilities.$instance).to.be.instanceof(
        SalteAuthUtilities
      );
    });
  });

  describe('function(createUrl)', () => {
    it('should support passing only a url', () => {
      const url = utilities.createUrl('https://google.com');

      expect(url).to.equal('https://google.com');
    });

    it('should support passing a url and a queryParams object', () => {
      const url = utilities.createUrl('https://google.com', {
        test: 'test'
      });

      expect(url).to.equal('https://google.com?test=test');
    });

    it('should allow "false" params', () => {
      const url = utilities.createUrl('https://google.com', {
        test: false
      });

      expect(url).to.equal('https://google.com?test=false');
    });

    it('should skip "" params', () => {
      const url = utilities.createUrl('https://google.com', {
        test: ''
      });

      expect(url).to.equal('https://google.com');
    });

    it('should skip "null" params', () => {
      const url = utilities.createUrl('https://google.com', {
        test: null
      });

      expect(url).to.equal('https://google.com');
    });

    it('should skip "undefined" params', () => {
      const url = utilities.createUrl('https://google.com', {
        test: undefined
      });

      expect(url).to.equal('https://google.com');
    });
  });

  describe('function(resolveUrl)', () => {
    it('should support paths', () => {
      expect(utilities.resolveUrl('/api/test')).to.equal(
        `${window.location.protocol}//${window.location.host}/api/test`
      );
    });

    it('should support full urls', () => {
      expect(utilities.resolveUrl('https://api.salte.io/api/test')).to.equal(
        'https://api.salte.io/api/test'
      );
    });
  });

  describe('function(checkForMatchingUrl)', () => {
    it('should support strings', () => {
      const match = utilities.checkForMatchingUrl('https://google.com/api', [
        'https://google.com/api'
      ]);

      expect(match).to.equal(true);
    });

    it('should support relative strings', () => {
      const match = utilities.checkForMatchingUrl(
        `${location.protocol}//${location.host}/api`,
        ['/api']
      );

      expect(match).to.equal(true);
    });

    it('should support regular expressions', () => {
      const match = utilities.checkForMatchingUrl(location.href, [
        new RegExp(location.host)
      ]);

      expect(match).to.equal(true);
    });

    it('should return false if there are no matches', () => {
      const match = utilities.checkForMatchingUrl(location.href, []);

      expect(match).to.equal(false);
    });

    it('should support passing nothing', () => {
      const match = utilities.checkForMatchingUrl(location.href);

      expect(match).to.equal(false);
    });
  });

  describe('function(isRouteSecure)', () => {
    it('should support globally requiring authentication', () => {
      expect(utilities.isRouteSecure('http://localhost:9876', true)).to.equal(
        true
      );
    });

    it('should support passing an array of secure routes', () => {
      const checkForMatchingUrlSpy = sandbox.spy(
        utilities,
        'checkForMatchingUrl'
      );
      expect(utilities.isRouteSecure('http://localhost:9876', ['/'])).to.equal(
        true
      );
      // Verify we're using our url match checker for arrays
      expect(checkForMatchingUrlSpy.callCount).to.equal(1);
    });

    it('should return false if no routes are secured', () => {
      expect(utilities.isRouteSecure('http://localhost:9876')).to.equal(false);
    });
  });

  describe('function(openPopup)', () => {
    it('should open a popup window', () => {
      sandbox.stub(window, 'open').returns({
        closed: false,
        focus() {},
        close() {
          this.closed = true;
        }
      });

      const promise = utilities.openPopup('https://www.google.com');

      setTimeout(() => {
        window.open.firstCall.returnValue.close();
      }, 200);

      return promise;
    });

    it('should handle blocked popups', () => {
      sandbox.stub(window, 'open').returns(null);

      const promise = utilities.openPopup('https://www.google.com');

      return promise
        .catch(error => {
          return error;
        })
        .then(error => {
          expect(error).to.be.instanceof(ReferenceError);
          expect(error.message).to.equal(
            'We were unable to open the popup window, its likely that the request was blocked.'
          );
        });
    });
  });

  describe('function(openNewTab)', () => {
    it('should open a new tab', () => {
      sandbox.stub(window, 'open').returns({
        closed: false,
        focus() {},
        close() {
          this.closed = true;
        }
      });

      const promise = utilities.openNewTab('https://www.google.com');

      setTimeout(() => {
        window.open.firstCall.returnValue.close();
      }, 200);

      return promise;
    });

    it('should handle blocked tabs', () => {
      sandbox.stub(window, 'open').returns(null);

      const promise = utilities.openNewTab('https://www.google.com');

      return promise.catch(error => {
        return error;
      }).then(error => {
        expect(error).to.be.instanceof(ReferenceError);
        expect(error.message).to.equal(
          'We were unable to open the new tab, its likely that the request was blocked.'
        );
      });
    });
  });

  describe('function(createIframe)', () => {
    it('should create a hidden iframe', () => {
      const promise = utilities.createIframe('https://www.google.com');
      const iframe = document.body.querySelector('iframe[owner="salte-auth"]');

      expect(iframe).to.not.be.undefined;
      expect(iframe.style.display).to.equal('none');
      document.body.removeChild(iframe);

      return promise;
    });

    it('should support showing the iframe', () => {
      const promise = utilities.createIframe('https://www.google.com', true);
      const iframe = document.body.querySelector('iframe[owner="salte-auth"]');

      expect(iframe).to.not.be.undefined;
      expect(iframe.style.display).to.equal('');
      document.body.removeChild(iframe);

      return promise;
    });
  });

  describe('function(addXHRInterceptor)', () => {
    afterEach(() => {
      utilities.$interceptors.xhr = [];
    });

    it('should intercept XHR requests', () => {
      const promises = [];
      promises.push(
        new Promise(resolve => {
          utilities.addXHRInterceptor((request, data) => {
            expect(data).to.be.undefined;
            resolve();
          });
        })
      );

      const request = new XMLHttpRequest();
      promises.push(
        new Promise(resolve => {
          request.addEventListener('load', function() {
            expect(this.responseText).to.contain(
              'This is the execution context.'
            );
            resolve();
          });
        })
      );
      request.open(
        'GET',
        `${location.protocol}//${location.host}/context.html`,
        false
      );
      request.send();
      return Promise.all(promises);
    });

    it('should support rejected promises', () => {
      const promises = [];
      utilities.addXHRInterceptor((request, data) => {
        return Promise.reject('Stuff broke!');
      });

      const request = new XMLHttpRequest();
      promises.push(
        new Promise(resolve => {
          request.addEventListener('error', event => {
            expect(event.detail).to.equal('Stuff broke!');
            resolve();
          });
        })
      );
      request.open(
        'GET',
        `${location.protocol}//${location.host}/context.html`,
        false
      );
      request.send();
      return Promise.all(promises);
    });
  });

  describe('function(addFetchInterceptor)', () => {
    const fetch = window.fetch;
    afterEach(() => {
      window.fetch = fetch;
      utilities.$interceptors.fetch = [];
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
      delete window.salte.SalteAuthUtilities.$instance;
      new SalteAuthUtilities();

      expect(window.fetch).to.equal(null);
    });
  });

  describe('getter($iframe)', () => {
    let iframe;
    const self = window.self;
    beforeEach(() => {
      iframe = document.createElement('iframe');
      iframe.setAttribute('owner', 'salte-auth');
      parent.document.body.appendChild(iframe);
    });

    afterEach(() => {
      window.self = self;
      parent.document.body.removeChild(iframe);
    });

    it('should return the iframe if we are in an iframe and the iframe is owned by "salte-auth"', () => {
      expect(utilities.$iframe).to.equal(iframe);
    });

    it('should return "null" if we are not inside an iframe', () => {
      window.self = window.top;
      expect(utilities.$iframe).to.equal(null);
    });

    it('should return "null" if we are in an iframe but the iframe is not owned by "salte-auth"', () => {
      iframe.removeAttribute('owner');
      window.self = window.top;
      expect(utilities.$iframe).to.equal(null);
    });
  });

  describe('getter($popup)', () => {
    const opener = window.opener;
    const name = window.name;
    afterEach(() => {
      window.opener = opener;
      window.name = name;
    });

    it('should return true if we are inside a popup window named "salte-auth"', () => {
      window.opener = true;
      window.name = 'salte-auth';
      expect(utilities.$popup).to.be.instanceof(Window);
    });

    it('should return false if we are inside a popup window not named "salte-auth', () => {
      window.opener = true;
      window.name = 'something-else';
      expect(utilities.$popup).to.equal(null);
    });

    it('should return false if we are not inside a popup window', () => {
      window.opener = false;
      window.name = 'salte-auth';
      expect(utilities.$popup).to.equal(null);
    });
  });
});
