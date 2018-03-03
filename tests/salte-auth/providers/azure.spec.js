import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';
import azure from '../../../src/providers/azure.js';

describe('azure', () => {
  const utilities = new SalteAuthUtilities();

  describe('function(authorizeEndpoint)', () => {
    it('should create a authorize endpoint', () => {
      expect(azure.authorizeEndpoint.call({ $utilities: utilities }, {
        providerUrl: 'https://login.microsoftonline.com/my-tenant'
      })).to.equal(`https://login.microsoftonline.com/my-tenant/oauth2/authorize`);
    });
  });

  describe('function(deauthorizeUrl)', () => {
    it('should create a logout url', () => {
      const url = azure.deauthorizeUrl.call({ $utilities: utilities }, {
        providerUrl: 'https://login.microsoftonline.com/my-tenant',
        redirectUrl: `${location.protocol}//${location.host}`
      });
      expect(url).to.equal(`https://login.microsoftonline.com/my-tenant/oauth2/logout?post_logout_redirect_uri=${encodeURIComponent(`${location.protocol}//${location.host}`)}`);
    });
  });
});
