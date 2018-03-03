import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';

describe('getter($iframe)', () => {
  let iframe;
  const self = window.self;
  let utilities;
  beforeEach(() => {
    utilities = new SalteAuthUtilities();
  });

  beforeEach(() => {
    iframe = document.createElement('iframe');
    iframe.setAttribute('owner', 'salte-auth');
    parent.document.body.appendChild(iframe);
  });

  afterEach(() => {
    window.self = self;
    parent.document.body.removeChild(iframe);
  });

  it('should return the iframe if we are in an iframe and the iframe is owned by "salte-auth"', () => {
    expect(utilities.$iframe).to.equal(iframe);
  });

  it('should return "null" if we are not inside an iframe', () => {
    window.self = window.top;
    expect(utilities.$iframe).to.equal(null);
  });

  it('should return "null" if we are in an iframe but the iframe is not owned by "salte-auth"', () => {
    iframe.removeAttribute('owner');
    window.self = window.top;
    expect(utilities.$iframe).to.equal(null);
  });
});
