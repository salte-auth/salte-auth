import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';

describe('getter($popup)', () => {
  let utilities;
  beforeEach(() => {
    utilities = new SalteAuthUtilities();
  });

  it('should return document.hidden', () => {
    expect(utilities.$hidden).to.equal(document.hidden);
  });
});
