import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';

describe('function(resolveUrl)', () => {
  let utilities;
  beforeEach(() => {
    utilities = new SalteAuthUtilities();
  });

  it('should support site root urls', () => {
    expect(utilities.resolveUrl('https://google.com')).to.equal('https://google.com');
  });

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
