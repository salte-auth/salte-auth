import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';

describe('function(createUrl)', () => {
  let utilities;
  beforeEach(() => {
    utilities = new SalteAuthUtilities();
  });

  it('should support passing only a url', () => {
    const url = utilities.createUrl('https://google.com');

    expect(url).to.equal('https://google.com');
  });

  it('should support passing a url and a queryParams object', () => {
    const url = utilities.createUrl('https://google.com', {
      test: 'test'
    });

    expect(url).to.equal('https://google.com?test=test');
  });

  it('should allow "false" params', () => {
    const url = utilities.createUrl('https://google.com', {
      test: false
    });

    expect(url).to.equal('https://google.com?test=false');
  });

  it('should skip "" params', () => {
    const url = utilities.createUrl('https://google.com', {
      test: ''
    });

    expect(url).to.equal('https://google.com');
  });

  it('should skip "null" params', () => {
    const url = utilities.createUrl('https://google.com', {
      test: null
    });

    expect(url).to.equal('https://google.com');
  });

  it('should skip "undefined" params', () => {
    const url = utilities.createUrl('https://google.com', {
      test: undefined
    });

    expect(url).to.equal('https://google.com');
  });
});
