import { expect } from 'chai';

import { SalteAuth } from '../../../src/salte-auth.js';
import cognito from '../../../src/providers/cognito.js';

const auth = new SalteAuth();

describe('cognito', () => {
  describe('function(deauthorizeUrl)', () => {
    it('should create a logout url', () => {
      const url = cognito.deauthorizeUrl.call(auth, {
        gateway: 'https://mydomain.auth.us-east-1.amazoncognito.com/oauth2',
        redirectUrl: `${location.protocol}//${location.host}`,
        clientId: '33333333-3333-4333-b333-333333333333'
      });
      expect(url).to.equal(`https://mydomain.auth.us-east-1.amazoncognito.com/logout?logout_uri=${encodeURIComponent(`${location.protocol}//${location.host}`)}&client_id=33333333-3333-4333-b333-333333333333`);
    });
  });
});
