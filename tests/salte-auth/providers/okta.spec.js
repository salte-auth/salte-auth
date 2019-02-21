import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';
import okta from '../../../src/providers/okta.js';

describe('cognito', () => {
  const utilities = new SalteAuthUtilities();

  describe('function(authorizeEndpoint)', () => {
    it('should create a authorize endpoint', () => {
      expect(okta.authorizeEndpoint.call({ $utilities: utilities }, {
        providerUrl: 'https://my-org.oktapreview.com'
      })).to.equal(`https://my-org.oktapreview.com/oauth2/v1/authorize`);
    });
  });

  describe('function(deauthorizeUrl)', () => {
    it('should create a logout url', () => {
      const url = new URL(okta.deauthorizeUrl.call({ $utilities: utilities }, {
        providerUrl: 'https://my-org.oktapreview.com',
        redirectUrl: `${location.protocol}//${location.host}`,
        idToken: '33333333-3333-4333-b333-333333333333'
      }));

      expect(url.origin + url.pathname).to.equal('https://my-org.oktapreview.com/oauth2/v1/logout');
      expect(url.searchParams.get('id_token_hint')).to.equal('33333333-3333-4333-b333-333333333333');
      expect(url.searchParams.get('post_logout_redirect_uri')).to.equal(`${location.protocol}//${location.host}`);
    });

    it('should support a separate logoutUrl', () => {
      const url = new URL(okta.deauthorizeUrl.call({ $utilities: utilities }, {
        providerUrl: 'https://my-org.oktapreview.com',
        redirectUrl: {
          logoutUrl: `${location.protocol}//${location.host}`
        },
        idToken: '33333333-3333-4333-b333-333333333333'
      }));

      expect(url.origin + url.pathname).to.equal('https://my-org.oktapreview.com/oauth2/v1/logout');
      expect(url.searchParams.get('id_token_hint')).to.equal('33333333-3333-4333-b333-333333333333');
      expect(url.searchParams.get('post_logout_redirect_uri')).to.equal(`${location.protocol}//${location.host}`);
    });
  });
});
