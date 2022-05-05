import chai from 'chai';
import chaiString from 'chai-string';

import { Okta } from '../../src/okta';

const { expect } = chai;
chai.use(chaiString);

describe('Okta', () => {
  describe('getter(name)', () => {
    it('should be "okta"', () => {
      const okta = new Okta({
        clientID: '12345',
        responseType: 'token'
      });

      expect(okta.name).to.equal('okta');
    });
  });

  describe('getter(login)', () => {
    it('should construct a login url', () => {
      const okta = new Okta({
        url: 'https://salte-os.oktapreview.com',

        clientID: '12345',
        responseType: 'id_token'
      });

      const url = new URL(okta.$login());

      expect(`${url.protocol}//${url.hostname}${url.pathname}`).to.equal('https://salte-os.oktapreview.com/oauth2/v1/authorize');
      expect(url.searchParams.get('client_id')).to.equal('12345');
      expect(url.searchParams.get('response_type')).to.equal('id_token');
      expect(url.searchParams.get('redirect_uri')).to.equal(location.origin);
      expect(url.searchParams.get('scope')).to.equal('openid');
      expect(url.searchParams.get('state')).to.startWith('okta-state-');
      expect(url.searchParams.get('nonce')).to.startWith('okta-nonce-');
    });
  });

  describe('getter(logout)', () => {
    it('should construct a logout url', () => {
      const okta = new Okta({
        url: 'https://salte-os.oktapreview.com',

        clientID: '12345',
        responseType: 'id_token'
      });

      okta.idToken = {
        raw: '54321'
      };

      const url = new URL(okta.logout);

      expect(`${url.protocol}//${url.hostname}${url.pathname}`).to.equal('https://salte-os.oktapreview.com/oauth2/v1/logout');

      expect(url.searchParams.get('id_token_hint')).to.equal('54321');
      expect(url.searchParams.get('post_logout_redirect_uri')).to.equal(location.origin);
    });
  });
});
