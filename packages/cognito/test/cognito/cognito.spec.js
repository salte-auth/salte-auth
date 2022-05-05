import chai from 'chai';
import chaiString from 'chai-string';
import { Cognito } from '../../src/cognito';

const { expect } = chai;
chai.use(chaiString);

describe('Cognito', () => {
  describe('getter(name)', () => {
    it('should be "cognito"', () => {
      const cognito = new Cognito({
        clientID: '12345',
        responseType: 'token'
      });

      expect(cognito.name).to.equal('cognito');
    });
  });

  describe('getter(login)', () => {
    it('should construct a login url', () => {
      const cognito = new Cognito({
        url: 'https://salte-os.auth.us-east-1.amazoncognito.com',

        clientID: '12345',
        responseType: 'token',

        routes: true
      });

      const url = new URL(cognito.$login());

      expect(`${url.protocol}//${url.hostname}${url.pathname}`).to.equal('https://salte-os.auth.us-east-1.amazoncognito.com/oauth2/authorize');
      expect(url.searchParams.get('client_id')).to.equal('12345');
      expect(url.searchParams.get('response_type')).to.equal('token');
      expect(url.searchParams.get('redirect_uri')).to.equal(location.origin);
      expect(url.searchParams.get('state')).to.startWith('cognito-state-');
    });
  });

  describe('getter(logout)', () => {
    it('should construct a logout url', () => {
      const cognito = new Cognito({
        url: 'https://salte-os.auth.us-east-1.amazoncognito.com',

        clientID: '12345',
        responseType: 'token',

        routes: true
      });

      const url = new URL(cognito.logout);

      expect(`${url.protocol}//${url.hostname}${url.pathname}`).to.equal('https://salte-os.auth.us-east-1.amazoncognito.com/logout');
      expect(url.searchParams.get('client_id')).to.equal('12345');
      expect(url.searchParams.get('logout_uri')).to.equal(location.origin);
    });
  });
});
