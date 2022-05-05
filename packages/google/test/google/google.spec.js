import chai from 'chai';
import chaiString from 'chai-string';
import { Google } from '../../src/google';

const { expect } = chai;
chai.use(chaiString);

describe('Google', () => {
  describe('getter(name)', () => {
    it('should be "google"', () => {
      const google = new Google({
        clientID: '12345',
        responseType: 'token'
      });

      expect(google.name).to.equal('google');
    });
  });

  describe('getter(login)', () => {
    it('should construct a login url', () => {
      const google = new Google({
        clientID: '12345',
        responseType: 'token'
      });

      const url = new URL(google.$login());

      expect(`${url.protocol}//${url.hostname}${url.pathname}`).to.equal('https://accounts.google.com/o/oauth2/v2/auth');
      expect(url.searchParams.get('client_id')).to.equal('12345');
      expect(url.searchParams.get('response_type')).to.equal('token');
      expect(url.searchParams.get('redirect_uri')).to.equal(location.origin);
      expect(url.searchParams.get('state')).to.startWith('google-state-');
    });
  });
});
