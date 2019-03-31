import { expect } from 'chai';

import { OAuth2, OpenID } from '../../src/generic';

describe('Generic', () => {
  describe('OAuth2', () => {
    let oauth2;
    beforeEach(() => {
      oauth2 = new OAuth2({
        login() {
          return 'https://google.com';
        }
      });
    });

    describe('constructor', () => {
      it('should require login', () => {
        expect(() => new OAuth2()).to.throw(Error, 'Missing the following required fields. (login)');
      });
    });

    describe('getter(name)', () => {
      it('should default the name to generic.oauth2', () => {
        expect(oauth2.name).to.equal('generic.oauth2');
      });
    });

    describe('getter(login)', () => {
      it('should support a custom login implementation', () => {
        expect(oauth2.login).to.equal('https://google.com');
      });
    });
  });

  describe('OpenID', () => {
    let openid;
    beforeEach(() => {
      openid = new OpenID({
        login() {
          return 'https://google.com/login';
        },

        logout() {
          return 'https://google.com/logout'
        }
      });
    });

    describe('constructor', () => {
      it('should require login and logout', () => {
        expect(() => new OpenID()).to.throw(Error, 'Missing the following required fields. (login, logout)');
      });
    });

    describe('getter(name)', () => {
      it('should default the name to generic.openid', () => {
        expect(openid.name).to.equal('generic.openid');
      });
    });

    describe('getter(login)', () => {
      it('should support a custom login implementation', () => {
        expect(openid.login).to.equal('https://google.com/login');
      });
    });

    describe('getter(logout)', () => {
      it('should support a custom logout implementation', () => {
        expect(openid.logout).to.equal('https://google.com/logout');
      });
    });
  });
});
