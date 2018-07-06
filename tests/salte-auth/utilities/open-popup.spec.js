import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';

describe('function(openPopup)', () => {
  let sandbox, utilities;
  beforeEach(() => {
    utilities = new SalteAuthUtilities({
      redirectUrl: 'https://redirect-url'
    });
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should open a popup window', () => {
    sandbox.stub(window, 'open').returns({
      closed: false,
      focus: sandbox.stub(),
      close: function() {
        this.closed = true;
      },
      location: {
        href: 'https://incorrect-redirect-url'
      }
    });

    setTimeout(() => {
      sandbox.stub(window.open.firstCall.returnValue, 'location').get(() => {
        return {
          href: 'https://redirect-url'
        };
      });
    }, 200);

    return utilities.openPopup('https://www.google.com');
  });

  it('should handle blocked popups', () => {
    sandbox.stub(window, 'open').returns(null);

    const promise = utilities.openPopup('https://www.google.com');

    return promise.catch(error => {
      return error;
    }).then(error => {
      expect(error).to.be.instanceof(ReferenceError);
      expect(error.message).to.equal(
        'We were unable to open the popup window, its likely that the request was blocked.'
      );
    });
  });

  it('should support a separate loginUrl', () => {
    utilities.$$config.redirectUrl = {
      loginUrl: 'https://redirect-url'
    };

    sandbox.stub(window, 'open').returns(null);

    const promise = utilities.openPopup('https://www.google.com');

    return promise.catch(error => {
      return error;
    }).then(error => {
      expect(error).to.be.instanceof(ReferenceError);
      expect(error.message).to.equal(
        'We were unable to open the popup window, its likely that the request was blocked.'
      );
    });
  });

  it('should support a separate logoutUrl', () => {
    utilities.$$config.redirectUrl = {
      logoutUrl: 'https://redirect-url'
    };

    sandbox.stub(window, 'open').returns(null);

    const promise = utilities.openPopup('https://www.google.com');

    return promise.catch(error => {
      return error;
    }).then(error => {
      expect(error).to.be.instanceof(ReferenceError);
      expect(error.message).to.equal(
        'We were unable to open the popup window, its likely that the request was blocked.'
      );
    });
  });
});
