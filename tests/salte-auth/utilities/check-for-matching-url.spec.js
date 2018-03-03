import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';

describe('function(checkForMatchingUrl)', () => {
  let utilities;
  beforeEach(() => {
    utilities = new SalteAuthUtilities();
  });

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
