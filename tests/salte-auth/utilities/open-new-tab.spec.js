import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';

describe('function(openNewTab)', () => {
  let utilities;
  beforeEach(() => {
    utilities = new SalteAuthUtilities({
      redirectUrl: 'https://redirect-url'
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should open a new tab', () => {
    sinon.stub(window, 'open').returns({
      closed: false,
      focus: sinon.stub(),
      close: function() {
        this.closed = true;
      },
      location: {
        href: 'https://incorrect-redirect-url'
      }
    });

    setTimeout(() => {
      sinon.stub(window.open.firstCall.returnValue, 'location').get(() => {
        return {
          href: 'https://redirect-url'
        };
      });
    }, 200);

    return utilities.openNewTab('https://www.google.com').then(() => {
      const tab = window.open.firstCall.returnValue;
      expect(tab.name).to.equal('salte-auth');
    });
  });

  it('should handle a user closing the new tab', () => {
    sinon.stub(window, 'open').returns({
      closed: true,
      focus: sinon.stub(),
      location: {
        href: 'https://incorrect-redirect-url'
      }
    });

    return utilities.openNewTab('https://www.google.com');
  });

  it('should handle blocked tabs', () => {
    sinon.stub(window, 'open').returns(null);

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

  it('should support a separate loginUrl', () => {
    utilities.$$config.redirectUrl = {
      loginUrl: 'https://redirect-url'
    };

    sinon.stub(window, 'open').returns(null);

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

  it('should support a separate logoutUrl', () => {
    utilities.$$config.redirectUrl = {
      logoutUrl: 'https://redirect-url'
    };

    sinon.stub(window, 'open').returns(null);

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
