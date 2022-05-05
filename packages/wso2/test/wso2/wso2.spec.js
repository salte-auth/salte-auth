import chai from 'chai';
import chaiString from 'chai-string';
import { WSO2 } from '../../src/wso2';

const { expect } = chai;
chai.use(chaiString);

describe('WSO2', () => {
  describe('getter(name)', () => {
    it('should be "wso2"', () => {
      const wso2 = new WSO2({
        clientID: '12345',
        responseType: 'token'
      });

      expect(wso2.name).to.equal('wso2');
    });
  });

  describe('getter(login)', () => {
    it('should construct a login url', () => {
      const wso2 = new WSO2({
        url: 'https://wso2.salte.io',

        clientID: '12345',
        responseType: 'id_token',

        routes: true
      });

      const url = new URL(wso2.$login());

      expect(`${url.protocol}//${url.hostname}${url.pathname}`).to.equal('https://wso2.salte.io/oauth2/authorize');
      expect(url.searchParams.get('client_id')).to.equal('12345');
      expect(url.searchParams.get('response_type')).to.equal('id_token');
      expect(url.searchParams.get('redirect_uri')).to.equal(location.origin);
      expect(url.searchParams.get('scope')).to.equal('openid');
      expect(url.searchParams.get('state')).to.startWith('wso2-state-');
      expect(url.searchParams.get('nonce')).to.startWith('wso2-nonce-');
    });
  });

  describe('getter(logout)', () => {
    it('should construct a logout url', () => {
      const wso2 = new WSO2({
        url: 'https://wso2.salte.io',

        clientID: '12345',
        responseType: 'id_token',

        routes: true
      });

      wso2.idToken = {
        raw: '54321'
      };

      const url = new URL(wso2.logout);

      expect(`${url.protocol}//${url.hostname}${url.pathname}`).to.equal('https://wso2.salte.io/oidc/logout');
      expect(url.searchParams.get('id_token_hint')).to.equal('54321');
      expect(url.searchParams.get('post_logout_redirect_uri')).to.equal(location.origin);
    });
  });
});
