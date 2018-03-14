import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';

describe('function(openNewTab)', () => {
  let sandbox, utilities;
  beforeEach(() => {
    utilities = new SalteAuthUtilities();
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should open a new tab', () => {
    const newTab = {
      closed: false,
      focus: sandbox.stub(),
      close: function() {
        this.closed = true;
      }
    };
    sandbox.stub(window, 'open').returns(newTab);

    const promise = utilities.openNewTab('https://www.google.com');
    
    expect(newTab.name).to.equal('salte-auth');

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
