import chai from 'chai';
import chaiString from 'chai-string';
import { GitHub } from '../../src/github';

const { expect } = chai;
chai.use(chaiString);

describe('GitHub', () => {
  describe('getter(name)', () => {
    it('should be "github"', () => {
      const github = new GitHub({
        clientID: '12345',
        responseType: 'token'
      });

      expect(github.name).to.equal('github');
    });
  });

  describe('getter(login)', () => {
    it('should construct a login url', () => {
      const github = new GitHub({
        clientID: '12345',
        responseType: 'token'
      });

      const url = new URL(github.$login());

      expect(`${url.protocol}//${url.hostname}${url.pathname}`).to.equal('https://github.com/login/oauth/authorize');
      expect(url.searchParams.get('client_id')).to.equal('12345');
      expect(url.searchParams.get('response_type')).to.equal('token');
      expect(url.searchParams.get('redirect_uri')).to.equal(location.origin);
      expect(url.searchParams.get('state')).to.startWith('github-state-');
    });
  });
});
