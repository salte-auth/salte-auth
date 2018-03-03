import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';

describe('getter($popup)', () => {
  const opener = window.opener;
  const name = window.name;
  let utilities;
  beforeEach(() => {
    utilities = new SalteAuthUtilities();
  });

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
