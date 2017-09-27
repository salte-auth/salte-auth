import { expect } from 'chai';
import moment from 'moment';

import { SalteAuthProfile } from '../../src/salte-auth.profile.js';

describe('salte-auth.profile', () => {
  let sandbox, profile;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sessionStorage.clear();
    profile = new SalteAuthProfile();
  });

  afterEach(() => {
    sandbox.restore();
    delete window.salte.SalteAuthProfile.$instance;
  });

  describe('function(constructor)', () => {
    beforeEach(() => {
      delete window.salte.SalteAuthProfile.$instance;
      sessionStorage.clear();
    });

    it('should be a singleton', () => {
      profile = new SalteAuthProfile();
      profile.bogus = 'test';

      expect(profile.bogus).to.equal('test');
      expect(new SalteAuthProfile().bogus).to.equal('test');
    });

    it('should recreate the path to the instance', () => {
      profile.bogus = 'test';
      expect(profile.bogus).to.equal('test');

      delete window.salte.SalteAuthProfile.$instance;

      profile = new SalteAuthProfile();

      expect(profile.bogus).to.be.undefined;
      expect(window.salte.SalteAuthProfile.$instance).to.be.instanceof(SalteAuthProfile);
    });

    it('should support parsing hash parameters', () => {
      history.replaceState(null, '', `${location.protocol}//${location.host}${location.pathname}#state=55555-55555`);
      profile = new SalteAuthProfile();
      expect(profile.state).to.equal('55555-55555');
    });
  });

  describe('function(parse)', () => {
    it('should parse the token_type', () => {
      profile.parse('token_type', 'access');
      expect(profile.tokenType).to.equal('access');
    });

    it('should parse the expires_in', () => {
      sandbox.useFakeTimers();
      profile.parse('expires_in', 5000);
      expect(profile.expiration).to.equal('5000');
    });

    it('should parse the access_token', () => {
      profile.parse('access_token', '12345-12345-12435');
      expect(profile.accessToken).to.equal('12345-12345-12435');
    });

    it('should parse the id_token', () => {
      profile.parse('id_token', '12345.12345.12345');
      expect(profile.idToken).to.equal('12345.12345.12345');
    });

    it('should parse the state', () => {
      profile.parse('state', '55555-555555');
      expect(profile.state).to.equal('55555-555555');
    });

    it('should parse the error', () => {
      profile.parse('error', 'your-fault');
      expect(profile.error).to.equal('your-fault');
    });

    it('should parse the error_description', () => {
      profile.parse('error_description', 'Look what you did!');
      expect(profile.errorDescription).to.equal('Look what you did!');
    });

    it('should ignore scope', () => {
      const warn = sandbox.stub(console, 'warn');
      expect(warn.callCount).to.equal(0);
      profile.parse('scope', 'opendid');
      expect(warn.callCount).to.equal(0);
    });
  });

  describe('getter(idTokenExpired)', () => {
    let clock;
    beforeEach(() => {
      profile.idToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImV4cCI6Mn0.r83Cirelw0YWTtTKw3WgbasJnneHMkXaPkqmj4DH418';
      clock = sandbox.useFakeTimers();
    });

    it('should be expired if the "id_token" is empty', () => {
      profile.idToken = null;
      expect(profile.idTokenExpired).to.equal(true);
    });

    it('should be expired if the "exp" is in the past', () => {
      clock.tick(2000);
      expect(profile.idTokenExpired).to.equal(true);
    });

    it('should not be expired if the "id_token" is present and the "exp" is in the future', () => {
      expect(profile.idTokenExpired).to.equal(false);
    });
  });

  describe('getter(accessTokenExpired)', () => {
    beforeEach(() => {
      profile.accessToken = '55555-555555';
    });

    it('should be expired if the "access_token" is empty', () => {
      profile.accessToken = null;
      expect(profile.accessTokenExpired).to.equal(true);
    });

    it('should be expired if the "expiration" is in the past', () => {
      expect(profile.accessTokenExpired).to.equal(true);
    });

    it('should not be expired if the "access_token" is present and the "expiration" is in the future', () => {
      profile.expiration = moment().add(1, 'hour').unix();
      expect(profile.accessTokenExpired).to.equal(false);
    });
  });

  describe('getter(redirectUrl)', () => {
    it('should be authenticated if the token has not expired', () => {
      expect(profile.redirectUrl).to.equal(null);
    });
  });

  describe('setter(redirectUrl)', () => {
    it('should set sessionStorage', () => {
      profile.redirectUrl = location.href;
      expect(sessionStorage.getItem('salte.auth.redirect-url')).to.equal(location.href);
    });
  });

  describe('getter(userInfo)', () => {
    it('should parse the "id_token"', () => {
      profile.idToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
      const userInfo = profile.userInfo;
      expect(userInfo).to.deep.equal({
        sub: '1234567890',
        name: 'John Doe',
        admin: true
      });
    });

    it('should return null if the "id_token" does not have three parts', () => {
      profile.idToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9';
      const userInfo = profile.userInfo;
      expect(userInfo).to.equal(null);
    });

    it('should return null if the "id_token" is undefined', () => {
      const userInfo = profile.userInfo;
      expect(userInfo).to.equal(null);
    });
  });

  describe('function(validate)', () => {
    it('should return an null if there are no issues', () => {
      profile.idToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsIm5vbmNlIjpudWxsfQ.MsykD5osfoXwKRr7IFz8XHgSkgIQTDHEtX432LS-QJc';
      profile.nonce = null;
      profile.localState = null;
      profile.state = null;
      const response = profile.validate();
      expect(response).to.be.undefined;
    });

    it('should return an error if "error" is defined', () => {
      profile.error = 'your-fault';
      profile.errorDescription = 'Look what you did!';
      const response = profile.validate();
      expect(response).to.deep.equal({
        code: 'your-fault',
        description: 'Look what you did!'
      });
    });

    it('should return an error if the "nonce" does not match the "id_token" nonce', () => {
      profile.idToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
      profile.nonce = '55555-55555';
      const response = profile.validate();
      expect(response).to.deep.equal({
        code: 'invalid_nonce',
        description: 'Nonce provided by gateway did not match local nonce.'
      });
    });

    it('should return an error if the "local-state" does not match the "state"', () => {
      profile.idToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsIm5vbmNlIjpudWxsfQ.MsykD5osfoXwKRr7IFz8XHgSkgIQTDHEtX432LS-QJc';
      profile.nonce = null;
      const response = profile.validate();
      expect(response).to.deep.equal({
        code: 'invalid_state',
        description: 'State provided by gateway did not match local state.'
      });
    });

    it('should skip "nonce" validation if the "access_token" is set', () => {
      profile.accessToken = 'abcdefg';
      profile.localState = null;
      profile.state = null;
      const response = profile.validate();
      expect(response).to.be.undefined;
    });
  });

  describe('function(saveItem)', () => {
    it('should save to sessionStorage', () => {
      profile.saveItem('bogus', 'bogus');
      expect(sessionStorage.getItem('bogus')).to.equal('bogus');
    });

    it('should allow other falsy values', () => {
      profile.saveItem('bogus', '');
      expect(sessionStorage.getItem('bogus')).to.equal('');
    });

    it('should delete items from sessionStorage when undefined', () => {
      profile.saveItem('bogus', undefined);
      expect(sessionStorage.getItem('bogus')).to.equal(null);
    });

    it('should delete items from sessionStorage when undefined', () => {
      profile.saveItem('bogus', undefined);
      expect(sessionStorage.getItem('bogus')).to.equal(null);
    });
  });

  describe('getter($storage)', () => {
    afterEach(() => {
      salte.auth.$config = {};
    });

    it('should default to sessionStorage', () => {
      expect(profile.$getStorage()).to.equal(sessionStorage);
    });

    it('should support using localStorage', () => {
      expect(profile.$getStorage('local')).to.equal(localStorage);
    });

    it('should error if the "storageType" is invalid', () => {
      expect(() => profile.$getStorage('bogus')).to.throw(ReferenceError, 'Unknown Storage Type (bogus)');
    });
  });

  describe('function(clear)', () => {
    beforeEach(() => {
      sessionStorage.setItem('salte.auth.id_token', '12345-12345-12345');
      sessionStorage.setItem('salte.auth.bogus', '12345');
      sessionStorage.setItem('bogus', '12345');
    });

    it('should remove all "salte.auth" items from sessionStorage', () => {
      profile.clear();

      expect(sessionStorage.getItem('salte.auth.id_token')).to.equal(null);
      expect(sessionStorage.getItem('salte.auth.bogus')).to.equal(null);
      expect(sessionStorage.getItem('bogus')).to.equal('12345');
    });
  });

  describe('function(clearErrors)', () => {
    beforeEach(() => {
      sessionStorage.setItem('salte.auth.id_token', '12345-12345-12345');
      sessionStorage.setItem('salte.auth.bogus', '12345');
      sessionStorage.setItem('bogus', '12345');
      sessionStorage.setItem('error', 'your-fault');
      sessionStorage.setItem('error_description', 'Look what you did!');
    });

    it('should remove all "salte.auth" items from sessionStorage', () => {
      profile.clearErrors();

      expect(sessionStorage.getItem('salte.auth.id_token')).to.equal('12345-12345-12345');
      expect(sessionStorage.getItem('salte.auth.bogus')).to.equal('12345');
      expect(sessionStorage.getItem('bogus')).to.equal('12345');
      expect(sessionStorage.getItem('error')).to.equal('your-fault');
      expect(sessionStorage.getItem('error_description')).to.equal('Look what you did!');
    });
  });
});
