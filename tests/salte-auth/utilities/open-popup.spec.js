import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';

describe('function(openPopup)', () => {
  let sandbox, utilities;
  beforeEach(() => {
    utilities = new SalteAuthUtilities();
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
