import chai from 'chai';
import chaiString from 'chai-string';
import { Bitbucket } from '../../src/bitbucket';

const { expect } = chai;
chai.use(chaiString);

describe('Bitbucket', () => {
  describe('getter(name)', () => {
    it('should be "bitbucket"', () => {
      const bitbucket = new Bitbucket({
        clientID: '12345',
        responseType: 'token'
      });

      expect(bitbucket.name).to.equal('bitbucket');
    });
  });

  describe('getter(login)', () => {
    it('should construct a login url', () => {
      const bitbucket = new Bitbucket({
        clientID: '12345',
        responseType: 'token'
      });

      const url = new URL(bitbucket.$login());

      expect(`${url.protocol}//${url.hostname}${url.pathname}`).to.equal('https://bitbucket.org/site/oauth2/authorize');
      expect(url.searchParams.get('client_id')).to.equal('12345');
      expect(url.searchParams.get('response_type')).to.equal('token');
      expect(url.searchParams.get('redirect_uri')).to.equal(location.origin);
      expect(url.searchParams.get('state')).to.startWith('bitbucket-state-');
    });
  });
});
