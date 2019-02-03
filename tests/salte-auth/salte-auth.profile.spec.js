import { expect } from 'chai';
import base64url from 'base64url';

import SalteAuthProfile from '../../src/salte-auth.profile.js';

describe('salte-auth.profile', () => {
  let sandbox, profile;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sessionStorage.clear();
    profile = new SalteAuthProfile();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('function(constructor)', () => {
    beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    it('should recreate the path to the instance', () => {
      profile.bogus = 'test';
      expect(profile.bogus).to.equal('test');

      profile = new SalteAuthProfile();

      expect(profile.bogus).to.be.undefined;
    });

    it('should not automatically parse hash parameters', () => {
      history.replaceState(
        null,
        '',
        `${location.protocol}//${location.host}${
          location.pathname
        }#state=55555-55555`
      );
      profile = new SalteAuthProfile();
      expect(profile.$state).to.equal(null);
    });
  });

  describe('function($hash)', () => {
    beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    it('should support parsing hash parameters', () => {
      history.replaceState(
        null,
        '',
        `${location.protocol}//${location.host}${
          location.pathname
        }#state=55555-55555`
      );

      profile.$hash();

      expect(profile.$state).to.equal('55555-55555');
    });
  });

  describe('function($parse)', () => {
    it('should parse the token_type', () => {
      profile.$parse('token_type', 'access');
      expect(profile.$tokenType).to.equal('access');
    });

    it('should parse the expires_in', () => {
      sandbox.useFakeTimers();
      expect(profile.$expiration).to.equal(null);
      profile.$parse('expires_in', 5000);
      expect(profile.$expiration).to.equal(5000000);
    });

    it('should parse the access_token', () => {
      profile.$parse('access_token', '12345-12345-12435');
      expect(profile.$accessToken).to.equal('12345-12345-12435');
    });

    it('should parse the id_token', () => {
      profile.$parse('id_token', '12345.12345.12345');
      expect(profile.$idToken).to.equal('12345.12345.12345');
    });

    it('should parse the state', () => {
      profile.$parse('state', '55555-555555');
      expect(profile.$state).to.equal('55555-555555');
    });

    it('should parse the error', () => {
      profile.$parse('error', 'your-fault');
      expect(profile.$error).to.equal('your-fault');
    });

    it('should parse the error_description', () => {
      profile.$parse('error_description', 'Look what you did!');
      expect(profile.$errorDescription).to.equal('Look what you did!');
    });

    it('should ignore scope', () => {
      const warn = sandbox.stub(console, 'warn');
      expect(warn.callCount).to.equal(0);
      profile.$parse('scope', 'opendid');
      expect(warn.callCount).to.equal(0);
    });
  });

  describe('getter(idTokenExpired)', () => {
    let clock;
    beforeEach(() => {
      profile.$idToken = `0.${btoa(
        JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          admin: true,
          exp: 2
        })
      )}.0`;
      profile.$refreshUserInfo();
      clock = sandbox.useFakeTimers();
    });

    it('should be expired if the "id_token" is empty', () => {
      profile.$idToken = null;
      profile.$refreshUserInfo();
      expect(profile.idTokenExpired).to.equal(true);
    });

    it('should be expired if the "exp" is in the past', () => {
      clock.tick(2001);
      expect(profile.idTokenExpired).to.equal(true);
    });

    it('should be expired if the "exp" is now', () => {
      clock.tick(2000);
      expect(profile.idTokenExpired).to.equal(true);
    });

    it('should not be expired if the "id_token" is present and the "exp" is in the future', () => {
      clock.tick(1999);
      expect(profile.idTokenExpired).to.equal(false);
    });
  });

  describe('getter(accessTokenExpired)', () => {
    beforeEach(() => {
      profile.$accessToken = '55555-555555';
      profile.$parse('expires_in', '1');
    });

    it('should be expired if the "access_token" is empty', () => {
      profile.$accessToken = null;
      expect(profile.accessTokenExpired).to.equal(true);
    });

    it('should be expired if the "expiration" is in the past', () => {
      expect(profile.accessTokenExpired).to.equal(false);
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      }).then(() => {
        expect(profile.accessTokenExpired).to.equal(true);
      });
    });

    it('should not be expired if the "access_token" is present and the "expiration" is in the future', () => {
      expect(profile.accessTokenExpired).to.equal(false);
    });
  });

  describe('getter(redirectUrl)', () => {
    it('should be authenticated if the token has not expired', () => {
      expect(profile.$redirectUrl).to.equal(null);
    });
  });

  describe('setter(redirectUrl)', () => {
    it('should set sessionStorage', () => {
      profile.$redirectUrl = location.href;
      expect(sessionStorage.getItem('salte.auth.$redirect-url')).to.equal(
        location.href
      );
    });
  });

  describe('function($refreshUserInfo)', () => {
    it('should parse the "id_token"', () => {
      profile.$idToken = `0.${btoa(
        JSON.stringify({
          sub: '1234567890',
          name: 'John Doe'
        })
      )}.0`;

      profile.$refreshUserInfo();
      const userInfo = profile.userInfo;

      expect(userInfo).to.deep.equal({
        sub: '1234567890',
        name: 'John Doe'
      });
    });

    it('should support decoding base64 url encoded tokens', () => {
      profile.$idToken = `0.${base64url.encode(
        JSON.stringify({
          'name': 'John Doe',
          'picture': 'https://s.gravatar.com/avatar/f944c2c12cc848203329ee871f6a5d5b?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fni.png'
        })
      )}.0`;

      profile.$refreshUserInfo();
      const userInfo = profile.userInfo;

      expect(userInfo).to.deep.equal({
        'name': 'John Doe',
        'picture': 'https://s.gravatar.com/avatar/f944c2c12cc848203329ee871f6a5d5b?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fni.png'
      });
    });

    it('should return null if the "id_token" does not have three parts', () => {
      profile.$idToken = '0.0';

      profile.$refreshUserInfo();
      const userInfo = profile.userInfo;

      expect(userInfo).to.equal(null);
    });

    it('should return null if the "id_token" is undefined', () => {
      profile.$refreshUserInfo();
      const userInfo = profile.userInfo;

      expect(userInfo).to.equal(null);
    });
  });

  describe('function($validate)', () => {
    it('should return an null if there are no issues', () => {
      profile.$idToken = `0.${btoa(
        JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          nonce: null,
          aud: '55555-55555'
        })
      )}.0`;
      profile.$nonce = null;
      profile.$localState = null;
      profile.$state = null;
      profile.$$config.clientId = '55555-55555';
      const response = profile.$validate();
      expect(response).to.deep.equal(undefined);
    });

    it('should not return an error if one  of the audiences matches the "clientId"', () => {
      profile.$idToken = `0.${btoa(
        JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          nonce: null,
          aud: ['55555-55555', 'test2'],
          azp: '55555-55555'
        })
      )}.0`;
      profile.$localState = null;
      profile.$state = null;
      profile.$nonce = null;
      profile.$$config.clientId = '55555-55555';
      const response = profile.$validate();
      expect(response).to.deep.equal(undefined);
    });

    it('should return an error if "error" is defined', () => {
      profile.$error = 'your-fault';
      profile.$errorDescription = 'Look what you did!';
      const response = profile.$validate();
      expect(response).to.deep.equal({
        code: 'your-fault',
        description: 'Look what you did!'
      });
    });

    it('should return an error if no "id_token" is defined', () => {
      const response = profile.$validate();
      expect(response).to.deep.equal({
        code: 'login_canceled',
        description:
          'User likely canceled the login or something unexpected occurred.'
      });
    });

    it('should return an error if the "local-state" does not match the "state"', () => {
      profile.$localState = '54321';
      profile.$state = '12345';
      profile.$idToken = `0.${btoa(
        JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          nonce: null
        })
      )}.0`;
      const response = profile.$validate();
      expect(response).to.deep.equal({
        code: 'invalid_state',
        description:
          'State provided by identity provider did not match local state.'
      });
    });

    it('should return an error if the "nonce" does not match the "id_token" nonce', () => {
      profile.$idToken = `0.${btoa(
        JSON.stringify({
          sub: '1234567890',
          name: 'John Doe'
        })
      )}.0`;
      profile.$nonce = '55555-55555';
      profile.$localState = null;
      profile.$state = null;
      const response = profile.$validate();
      expect(response).to.deep.equal({
        code: 'invalid_nonce',
        description:
          'Nonce provided by identity provider did not match local nonce.'
      });
    });

    it('should return an error if the "aud" does not match the "clientId"', () => {
      profile.$idToken = `0.${btoa(
        JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          nonce: null,
          aud: '55555-55555'
        })
      )}.0`;
      profile.$localState = null;
      profile.$state = null;
      profile.$nonce = null;
      const response = profile.$validate();
      expect(response).to.deep.equal({
        code: 'invalid_aud',
        description: 'The audience did not match the Client ID.'
      });
    });

    it('should return an error if there are multiple audiences and the azp is not present', () => {
      profile.$idToken = `0.${btoa(
        JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          admin: true,
          nonce: null,
          aud: ['test', 'test2']
        })
      )}.0`;
      profile.$localState = null;
      profile.$state = null;
      profile.$nonce = null;
      const response = profile.$validate();
      expect(response).to.deep.equal({
        code: 'invalid_azp',
        description:
          'Audience was returned as an array and AZP was not present on the ID Token.'
      });
    });

    it('should return an error if there are multiple audiences and the azp does not match the client id', () => {
      profile.$idToken = `0.${btoa(
        JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          admin: true,
          nonce: null,
          aud: ['test', 'test2'],
          azp: '55555-55555'
        })
      )}.0`;
      profile.$localState = null;
      profile.$state = null;
      profile.$nonce = null;
      const response = profile.$validate();
      expect(response).to.deep.equal({
        code: 'invalid_azp',
        description: 'AZP does not match the Client ID.'
      });
    });

    it('should return an error if none of the audiences match the "clientId"', () => {
      profile.$idToken = `0.${btoa(
        JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          admin: true,
          nonce: null,
          aud: ['test', 'test2'],
          azp: '55555-55555'
        })
      )}.0`;
      profile.$localState = null;
      profile.$state = null;
      profile.$nonce = null;
      profile.$$config.clientId = '55555-55555';
      const response = profile.$validate();
      expect(response).to.deep.equal({
        code: 'invalid_aud',
        description: 'None of the audience values matched the Client ID.'
      });
    });

    it('should skip "nonce" validation if the "access_token" is set', () => {
      profile.$idToken = `0.${btoa(
        JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          admin: true
        })
      )}.0`;
      profile.$localState = null;
      profile.$state = null;
      const response = profile.$validate(true);
      expect(response).to.deep.equal(undefined);
    });

    it('should skip individual validation if it is disabled', () => {
      profile.$idToken = `0.${btoa(
        JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          admin: true,
          nonce: '55555-55555',
          aud: ['55555-55555'],
          azp: '55555-55555'
        })
      )}.0`;
      profile.$$config.validation = {
        nonce: false,
        state: false,
        azp: false,
        aud: false
      };
      profile.$localState = null;
      profile.$state = null;
      const response = profile.$validate();
      expect(response).to.be.undefined;
    });

    it('should skip all validation if it is disabled', () => {
      profile.$$config.validation = false;
      profile.$localState = null;
      profile.$state = null;
      const response = profile.$validate();
      expect(response).to.be.undefined;
    });
  });

  describe('function($saveItem)', () => {
    it('should save to sessionStorage', () => {
      profile.$saveItem('bogus', 'bogus');
      expect(sessionStorage.getItem('bogus')).to.equal('bogus');
    });

    it('should allow overriding the default storage', () => {
      profile.$saveItem('bogus', 'bogus', 'local');
      expect(localStorage.getItem('bogus')).to.equal('bogus');
    });

    it('should allow other falsy values', () => {
      profile.$saveItem('bogus', '');
      expect(sessionStorage.getItem('bogus')).to.equal('');
    });

    it('should delete items from sessionStorage when undefined', () => {
      profile.$saveItem('bogus', undefined);
      expect(sessionStorage.getItem('bogus')).to.equal(null);
    });

    it('should delete items from sessionStorage when undefined', () => {
      profile.$saveItem('bogus', undefined);
      expect(sessionStorage.getItem('bogus')).to.equal(null);
    });
  });

  describe('function($getItem)', () => {
    it('should save to sessionStorage', () => {
      profile.$saveItem('bogus', 'bogus');
      expect(profile.$getItem('bogus')).to.equal('bogus');
    });

    it('should return null if the value does not exist', () => {
      profile.$saveItem('bogus', null);
      expect(profile.$getItem('bogus')).to.equal(null);
    });

    it('should support overriding the default storage', () => {
      profile.$saveItem('bogus', '', 'local');
      expect(profile.$getItem('bogus', 'local')).to.equal(localStorage.getItem('bogus'));
    });
  });

  describe('getter($storage)', () => {
    it('should support using sessionStorage', () => {
      expect(profile.$$getStorage('session')).to.equal(sessionStorage);
    });

    it('should support using localStorage', () => {
      expect(profile.$$getStorage('local')).to.equal(localStorage);
    });

    it('should error if the "storageType" is invalid', () => {
      expect(() => profile.$$getStorage('bogus')).to.throw(
        ReferenceError,
        'Unknown Storage Type (bogus)'
      );
    });
  });

  describe('function($clear)', () => {
    it('should remove all "salte.auth" items from localStorage', () => {
      localStorage.setItem('salte.auth.$test', '123');
      localStorage.setItem('salte.auth.id_token', '12345-12345-12345');
      localStorage.setItem('salte.auth.bogus', '12345');
      localStorage.setItem('bogus', '12345');

      profile.$clear();

      expect(localStorage.getItem('salte.auth.$test')).to.equal('123');
      expect(localStorage.getItem('salte.auth.id_token')).to.equal(null);
      expect(localStorage.getItem('salte.auth.bogus')).to.equal(null);
      expect(localStorage.getItem('bogus')).to.equal('12345');
    });

    it('should remove all "salte.auth" items from sessionStorage', () => {
      sessionStorage.setItem('salte.auth.$test', '123');
      sessionStorage.setItem('salte.auth.id_token', '12345-12345-12345');
      sessionStorage.setItem('salte.auth.bogus', '12345');
      sessionStorage.setItem('bogus', '12345');

      profile.$clear();

      expect(sessionStorage.getItem('salte.auth.$test')).to.equal('123');
      expect(sessionStorage.getItem('salte.auth.id_token')).to.equal(null);
      expect(sessionStorage.getItem('salte.auth.bogus')).to.equal(null);
      expect(sessionStorage.getItem('bogus')).to.equal('12345');
    });
  });

  describe('function($clearErrors)', () => {
    beforeEach(() => {
      sessionStorage.setItem('salte.auth.id_token', '12345-12345-12345');
      sessionStorage.setItem('salte.auth.bogus', '12345');
      sessionStorage.setItem('bogus', '12345');
      sessionStorage.setItem('error', 'your-fault');
      sessionStorage.setItem('error_description', 'Look what you did!');
    });

    it('should remove all "salte.auth" items from sessionStorage', () => {
      profile.$clearErrors();

      expect(sessionStorage.getItem('salte.auth.id_token')).to.equal(
        '12345-12345-12345'
      );
      expect(sessionStorage.getItem('salte.auth.bogus')).to.equal('12345');
      expect(sessionStorage.getItem('bogus')).to.equal('12345');
      expect(sessionStorage.getItem('error')).to.equal('your-fault');
      expect(sessionStorage.getItem('error_description')).to.equal(
        'Look what you did!'
      );
    });
  });
});
