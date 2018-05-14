import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';

describe('function(openNewTab)', () => {
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

  it('should open a new tab', () => {
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

    return utilities.openNewTab('https://www.google.com').then(() => {
      const tab = window.open.firstCall.returnValue;
      expect(tab.name).to.equal('salte-auth');
    });
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
