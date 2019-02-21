import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';
import azure from '../../../src/providers/azure.js';

describe('azure', () => {
  const utilities = new SalteAuthUtilities();

  describe('function(authorizeEndpoint)', () => {
    it('should create a authorize endpoint', () => {
      const url = new URL(azure.authorizeEndpoint.call({ $utilities: utilities }, {
        providerUrl: 'https://login.microsoftonline.com/my-tenant'
      }));

      expect(url.origin + url.pathname).to.equal('https://login.microsoftonline.com/my-tenant/oauth2/authorize');
    });
  });

  describe('function(deauthorizeUrl)', () => {
    it('should create a logout url', () => {
      const url = new URL(azure.deauthorizeUrl.call({ $utilities: utilities }, {
        providerUrl: 'https://login.microsoftonline.com/my-tenant',
        redirectUrl: `${location.protocol}//${location.host}`
      }));

      expect(url.origin + url.pathname).to.equal('https://login.microsoftonline.com/my-tenant/oauth2/logout');
      expect(url.searchParams.get('post_logout_redirect_uri')).to.equal(`${location.protocol}//${location.host}`);
    });

    it('should support a separate logoutUrl', () => {
      const url = new URL(azure.deauthorizeUrl.call({ $utilities: utilities }, {
        providerUrl: 'https://login.microsoftonline.com/my-tenant',
        redirectUrl: {
          logoutUrl: `${location.protocol}//${location.host}`
        },
        clientId: '33333333-3333-4333-b333-333333333333'
      }));

      expect(url.origin + url.pathname).to.equal('https://login.microsoftonline.com/my-tenant/oauth2/logout');
      expect(url.searchParams.get('post_logout_redirect_uri')).to.equal(`${location.protocol}//${location.host}`);
    });
  });
});
