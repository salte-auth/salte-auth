import { expect } from 'chai';

import { SalteAuthMixinGenerator } from '../../src/salte-auth.mixin.js';

describe('salte-auth.mixin', () => {
  let auth, mixin, MyElement;
  beforeEach(() => {
    auth = {
      listeners: {},
      on: sinon.stub().callsFake((event, cb) => {
        auth.listeners[event] = auth.listeners[event] || [];
        auth.listeners[event].push(cb);
      }),
      profile: {
        userInfo: {},
        idTokenExpired: {}
      }
    };

    sinon.stub(auth.profile, 'userInfo').get(() => {
      return { sub: '12345' };
    });

    sinon.stub(auth.profile, 'idTokenExpired').get(() => false);
    mixin = SalteAuthMixinGenerator(auth);

    class Test {}
    MyElement = class extends mixin(Test) {};
  });

  describe('function(generator)', () => {
    it('should create a mixin', () => {
      expect(auth.on.callCount).to.equal(3);
      expect(typeof(mixin)).to.equal('function');
    });

    it('should support being mixed with a class', () => {
      const element = new MyElement();
      expect(element.auth).to.equal(auth);
      expect(element.user).to.deep.equal({ sub: '12345' });
    });

    it('should default the user to null if not present', () => {
      delete auth.profile.userInfo;
      const element = new MyElement();
      expect(element.user).to.equal(null);
    });
  });

  describe('on(login)', () => {
    beforeEach(() => {
      sinon.stub(auth.profile, 'userInfo').get(() => null);
      sinon.stub(auth.profile, 'idTokenExpired').get(() => true);
    });

    it('should support being authenticated', () => {
      const element = new MyElement();
      expect(element.authenticated).to.equal(false);
      expect(element.user).to.deep.equal(null);

      auth.listeners.login.forEach((cb) => cb(null, { sub: '54321' }));

      expect(element.authenticated).to.equal(false); // This is determined by whether the id token is expired, so it should still be false
      expect(element.user).to.deep.equal({ sub: '54321' });
    });
  });

  describe('on(logout)', () => {
    it('should support being deauthenticated', () => {
      const element = new MyElement();
      expect(element.authenticated).to.equal(true);
      expect(element.user).to.deep.equal({ sub: '12345' });

      auth.listeners.logout.forEach((cb) => cb());

      expect(element.authenticated).to.equal(false); // This is determined by whether the id token is expired, so it should still be false
      expect(element.user).to.deep.equal(null);
    });
  });

  describe('on(expired)', () => {
    it('should no longer be authenticated', () => {
      const element = new MyElement();
      expect(element.authenticated).to.equal(true);
      auth.listeners.expired.forEach((cb) => cb());
      expect(element.authenticated).to.equal(false);
    });
  });
});
