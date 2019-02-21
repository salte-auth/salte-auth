import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';
import cognito from '../../../src/providers/cognito.js';

describe('cognito', () => {
  const utilities = new SalteAuthUtilities();

  describe('function(authorizeEndpoint)', () => {
    it('should create a authorize endpoint', () => {
      const url = new URL(cognito.authorizeEndpoint.call({ $utilities: utilities }, {
        providerUrl: 'https://mydomain.auth.us-east-1.amazoncognito.com'
      }));

      expect(url.origin + url.pathname).to.equal('https://mydomain.auth.us-east-1.amazoncognito.com/oauth2/authorize');
    });
  });

  describe('function(deauthorizeUrl)', () => {
    it('should create a logout url', () => {
      const url = new URL(cognito.deauthorizeUrl.call({ $utilities: utilities }, {
        providerUrl: 'https://mydomain.auth.us-east-1.amazoncognito.com',
        redirectUrl: `${location.protocol}//${location.host}`,
        clientId: '33333333-3333-4333-b333-333333333333'
      }));

      expect(url.origin + url.pathname).to.equal('https://mydomain.auth.us-east-1.amazoncognito.com/logout');
      expect(url.searchParams.get('client_id')).to.equal('33333333-3333-4333-b333-333333333333');
      expect(url.searchParams.get('logout_uri')).to.equal(`${location.protocol}//${location.host}`);
    });

    it('should support a separate logoutUrl', () => {
      const url = new URL(cognito.deauthorizeUrl.call({ $utilities: utilities }, {
        providerUrl: 'https://mydomain.auth.us-east-1.amazoncognito.com',
        redirectUrl: {
          logoutUrl: `${location.protocol}//${location.host}`
        },
        clientId: '33333333-3333-4333-b333-333333333333'
      }));

      expect(url.origin + url.pathname).to.equal('https://mydomain.auth.us-east-1.amazoncognito.com/logout');
      expect(url.searchParams.get('client_id')).to.equal('33333333-3333-4333-b333-333333333333');
      expect(url.searchParams.get('logout_uri')).to.equal(`${location.protocol}//${location.host}`);
    });
  });

  describe('getter(defaultConfig)', () => {
    it('should return a default config', () => {
      expect(cognito.defaultConfig).to.deep.equal({
        validation: {
          nonce: false
        }
      });
    });
  });
});
