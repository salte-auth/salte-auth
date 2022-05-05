import chai from 'chai';
import chaiString from 'chai-string';
import { Facebook } from '../../src/facebook';

const { expect } = chai;
chai.use(chaiString);

describe('Facebook', () => {
  describe('getter(name)', () => {
    it('should be "facebook"', () => {
      const facebook = new Facebook({
        clientID: '12345',
        responseType: 'token'
      });

      expect(facebook.name).to.equal('facebook');
    });
  });

  describe('getter(login)', () => {
    it('should construct a login url', () => {
      const facebook = new Facebook({
        clientID: '12345',
        responseType: 'token'
      });

      const url = new URL(facebook.$login());

      expect(`${url.protocol}//${url.hostname}${url.pathname}`).to.equal('https://www.facebook.com/v6.0/dialog/oauth');
      expect(url.searchParams.get('client_id')).to.equal('12345');
      expect(url.searchParams.get('response_type')).to.equal('token');
      expect(url.searchParams.get('redirect_uri')).to.equal(location.origin);
      expect(url.searchParams.get('state')).to.startWith('facebook-state-');
    });
  });
});
