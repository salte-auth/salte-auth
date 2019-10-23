import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';

describe('function(createIframe)', () => {
  let utilities;
  beforeEach(() => {
    utilities = new SalteAuthUtilities();
  });

  it('should create a hidden iframe', () => {
    const promise = utilities.createIframe('https://www.google.com');
    const iframe = document.body.querySelector('iframe[owner="salte-auth"]');

    expect(iframe).to.not.be.undefined;
    expect(iframe.style.display).to.equal('none');
    document.body.removeChild(iframe);

    return promise;
  });

  it('should support showing the iframe', () => {
    const promise = utilities.createIframe('https://www.google.com', true);
    const iframe = document.body.querySelector('iframe[owner="salte-auth"]');

    expect(iframe).to.not.be.undefined;
    expect(iframe.style.display).to.equal('');
    document.body.removeChild(iframe);

    return promise;
  });

  it('should support timing out', async () => {
    const promise = utilities.createIframe('https://www.google.com', true, 100);
    const iframe = document.body.querySelector('iframe[owner="salte-auth"]');

    expect(iframe).to.not.be.undefined;
    expect(iframe.style.display).to.equal('');

    const error = await promise.catch((error) => error);

    expect(error.message).to.equal('Iframe failed to respond in time.');
  });
});
