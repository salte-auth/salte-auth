import chai from 'chai';
import chaiString from 'chai-string';
import { Auth0 } from '../../src/auth0';

const { expect } = chai;
chai.use(chaiString);

describe('Auth0', () => {
  describe('getter(name)', () => {
    it('should be "auth0"', () => {
      const auth0 = new Auth0({
        clientID: '12345',
        responseType: 'token'
      });

      expect(auth0.name).to.equal('auth0');
    });
  });

  describe('getter(login)', () => {
    it('should construct a login url', () => {
      const auth0 = new Auth0({
        url: 'https://salte-os.auth0.com',

        clientID: '12345',
        responseType: 'id_token',

        routes: true
      });

      const url = new URL(auth0.$login());

      expect(`${url.protocol}//${url.hostname}${url.pathname}`).to.equal('https://salte-os.auth0.com/authorize');
      expect(url.searchParams.get('client_id')).to.equal('12345');
      expect(url.searchParams.get('response_type')).to.equal('id_token');
      expect(url.searchParams.get('redirect_uri')).to.equal(location.origin);
      expect(url.searchParams.get('scope')).to.equal('openid');
      expect(url.searchParams.get('state')).to.startWith('auth0-state-');
      expect(url.searchParams.get('nonce')).to.startWith('auth0-nonce-');
    });
  });

  describe('getter(logout)', () => {
    it('should construct a logout url', () => {
      const auth0 = new Auth0({
        url: 'https://salte-os.auth0.com',

        clientID: '12345',
        responseType: 'id_token',

        routes: true
      });

      const url = new URL(auth0.logout);

      expect(`${url.protocol}//${url.hostname}${url.pathname}`).to.equal('https://salte-os.auth0.com/v2/logout');
      expect(url.searchParams.get('client_id')).to.equal('12345');
      expect(url.searchParams.get('returnTo')).to.equal(location.origin);
    });
  });
});
