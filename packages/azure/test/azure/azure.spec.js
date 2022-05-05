import chai from 'chai';
import chaiString from 'chai-string';
import { Azure } from '../../src/azure';

const { expect } = chai;
chai.use(chaiString);

describe('Azure', () => {
  describe('getter(name)', () => {
    it('should be "azure"', () => {
      const azure = new Azure({
        clientID: '12345',
        responseType: 'token'
      });

      expect(azure.name).to.equal('azure');
    });
  });

  describe('getter(login)', () => {
    it('should construct a login url', () => {
      const azure = new Azure({
        url: 'https://login.microsoftonline.com/salte-os',

        clientID: '12345',
        responseType: 'id_token',

        routes: true
      });

      const url = new URL(azure.$login());

      expect(`${url.protocol}//${url.hostname}${url.pathname}`).to.equal('https://login.microsoftonline.com/salte-os/oauth2/v2.0/authorize');
      expect(url.searchParams.get('client_id')).to.equal('12345');
      expect(url.searchParams.get('response_type')).to.equal('id_token');
      expect(url.searchParams.get('redirect_uri')).to.equal(location.origin);
      expect(url.searchParams.get('scope')).to.equal('openid');
      expect(url.searchParams.get('state')).to.startWith('azure-state-');
      expect(url.searchParams.get('nonce')).to.startWith('azure-nonce-');
    });
  });

  describe('getter(logout)', () => {
    it('should construct a logout url', () => {
      const azure = new Azure({
        url: 'https://login.microsoftonline.com/salte-os',

        clientID: '12345',
        responseType: 'id_token',

        routes: true
      });

      const url = new URL(azure.logout);

      expect(`${url.protocol}//${url.hostname}${url.pathname}`).to.equal('https://login.microsoftonline.com/salte-os/oauth2/logout');
      expect(url.searchParams.get('post_logout_redirect_uri')).to.equal(location.origin);
    });
  });
});
