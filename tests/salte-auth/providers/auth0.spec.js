import { expect } from 'chai';

import { SalteAuth } from '../../../src/salte-auth.js';
import auth0 from '../../../src/providers/auth0.js';

const auth = new SalteAuth({
  provider: 'auth0'
});

describe('auth0', () => {
  describe('function(deauthorizeUrl)', () => {
    it('should create a logout url', () => {
      const url = auth0.deauthorizeUrl.call(auth, {
        gateway: 'https://api.salte.io',
        redirectUrl: `${location.protocol}//${location.host}`,
        clientId: '33333333-3333-4333-b333-333333333333'
      });
      expect(url).to.equal(`https://api.salte.io/v2/logout?returnTo=${encodeURIComponent(`${location.protocol}//${location.host}`)}&client_id=33333333-3333-4333-b333-333333333333`);
    });
  });
});
