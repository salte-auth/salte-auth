import { expect } from 'chai';

import { SalteAuth } from '../../../src/salte-auth.js';
import azure from '../../../src/providers/azure.js';

const auth = new SalteAuth({
  provider: 'azure'
});

describe('azure', () => {
  describe('function(authorizeUrl)', () => {
    it('should create a login url', () => {
      expect(azure.authorizeUrl.call(auth, {
        gateway: 'https://login.microsoftonline.com/my-tenant'
      })).to.equal(`https://login.microsoftonline.com/my-tenant/oauth2/authorize`);
    });
  });

  describe('function(deauthorizeUrl)', () => {
    it('should create a logout url', () => {
      const url = azure.deauthorizeUrl.call(auth, {
        gateway: 'https://login.microsoftonline.com/my-tenant',
        redirectUrl: `${location.protocol}//${location.host}`
      });
      expect(url).to.equal(`https://login.microsoftonline.com/my-tenant/oauth2/logout?post_logout_redirect_uri=${encodeURIComponent(`${location.protocol}//${location.host}`)}`);
    });
  });
});
