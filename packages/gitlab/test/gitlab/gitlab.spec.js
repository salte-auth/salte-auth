import chai from 'chai';
import chaiString from 'chai-string';
import { GitLab } from '../../src/gitlab';

const { expect } = chai;
chai.use(chaiString);

describe('GitLab', () => {
  describe('getter(name)', () => {
    it('should be "gitlab"', () => {
      const gitlab = new GitLab({
        clientID: '12345',
        responseType: 'token'
      });

      expect(gitlab.name).to.equal('gitlab');
    });
  });

  describe('getter(login)', () => {
    it('should construct a login url', () => {
      const gitlab = new GitLab({
        clientID: '12345',
        responseType: 'token'
      });

      const url = new URL(gitlab.$login());

      expect(`${url.protocol}//${url.hostname}${url.pathname}`).to.equal('https://gitlab.com/oauth/authorize');
      expect(url.searchParams.get('client_id')).to.equal('12345');
      expect(url.searchParams.get('response_type')).to.equal('token');
      expect(url.searchParams.get('redirect_uri')).to.equal(location.origin);
      expect(url.searchParams.get('state')).to.startWith('gitlab-state-');
    });
  });
});
