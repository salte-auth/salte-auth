import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';

describe('function(isRouteSecure)', () => {
  let utilities;
  beforeEach(() => {
    utilities = new SalteAuthUtilities();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should support globally requiring authentication', () => {
    const secured = utilities.isRouteSecure(`${location.protocol}//${location.host}`, true);

    expect(secured).to.equal(true);
  });

  it('should support passing an array of secure routes', () => {
    const spy = sinon.spy(utilities, 'checkForMatchingUrl');

    const secured = utilities.isRouteSecure(`${location.protocol}//${location.host}`, ['/']);

    expect(secured).to.equal(true);
    // Verify we're using our url match checker for arrays
    expect(spy.callCount).to.equal(1);
  });

  it('should return false if no routes are secured', () => {
    const secured = utilities.isRouteSecure(`${location.protocol}//${location.host}`);

    expect(secured).to.equal(false);
  });
});
