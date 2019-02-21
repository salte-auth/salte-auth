import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';
import auth0 from '../../../src/providers/auth0.js';

describe('auth0', () => {
  const utilities = new SalteAuthUtilities();

  describe('function(deauthorizeUrl)', () => {
    it('should create a logout url', () => {
      const url = new URL(auth0.deauthorizeUrl.call({ $utilities: utilities }, {
        providerUrl: 'https://api.salte.io',
        redirectUrl: `${location.protocol}//${location.host}`,
        clientId: '33333333-3333-4333-b333-333333333333'
      }));

      expect(url.origin + url.pathname).to.equal('https://api.salte.io/v2/logout');
      expect(url.searchParams.get('client_id')).to.equal('33333333-3333-4333-b333-333333333333');
      expect(url.searchParams.get('returnTo')).to.equal(`${location.protocol}//${location.host}`);
    });

    it('should support a separate logoutUrl', () => {
      const url = new URL(auth0.deauthorizeUrl.call({ $utilities: utilities }, {
        providerUrl: 'https://api.salte.io',
        redirectUrl: {
          logoutUrl: `${location.protocol}//${location.host}`
        },
        clientId: '33333333-3333-4333-b333-333333333333'
      }));

      expect(url.origin + url.pathname).to.equal('https://api.salte.io/v2/logout');
      expect(url.searchParams.get('client_id')).to.equal('33333333-3333-4333-b333-333333333333');
      expect(url.searchParams.get('returnTo')).to.equal(`${location.protocol}//${location.host}`);
    });
  });
});
