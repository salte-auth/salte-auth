import { expect } from 'chai';
import sinon from 'sinon';

import { CookieStorage } from '../../../../src/utils/storage';

describe('CookieStorage', () => {
  const storage = new CookieStorage();

  beforeEach(() => {
    storage.clear();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('function(supported)', () => {
    it('should return true if we successfully save the cookie', () => {
      expect(CookieStorage.supported()).equals(true);
    });

    it('should return false if we fail to save the cookie', () => {
      sinon.stub(navigator, 'cookieEnabled').get(() => false);

      expect(CookieStorage.supported()).equals(false);
    });
  });

  describe('function(get)', () => {
    it('should pull from cookies', () => {
      document.cookie = 'hello=world';

      expect(storage.get('hello')).to.equal('world');
    });

    it('should support undefined values', () => {
      expect(storage.get('bogus')).to.equal(null);
    });

    it('should support default values', () => {
      expect(storage.get('bogus', 'default')).to.equal('default');
    });
  });

  describe('function(set)', () => {
    it('should support setting cookies', () => {
      expect(storage.get('hello')).to.equal(null);

      storage.set('hello', 'world');

      expect(storage.get('hello')).to.equal('world');
    });

    it('should support being scoped', () => {
      const scopedStorage = new CookieStorage('scoped');

      expect(scopedStorage.get('hello')).to.equal(null);

      scopedStorage.set('hello', 'world');

      expect(scopedStorage.get('hello')).to.equal('world');
      expect(document.cookie).to.equal('scoped.hello=world');
    });

    it('should automatically remove null values', () => {
      expect(storage.get('hello')).to.equal(null);

      storage.set('hello', 'world');

      expect(storage.get('hello')).to.equal('world');

      storage.set('hello', null);

      expect(storage.get('hello')).to.equal(null);
    });

    it('should automatically remove undefined values', () => {
      expect(storage.get('hello')).to.equal(null);

      storage.set('hello', 'world');

      expect(storage.get('hello')).to.equal('world');

      storage.set('hello', undefined);

      expect(storage.get('hello')).to.equal(null);
    });
  });

  describe('function(clear)', () => {
    it('should clear all values', () => {
      expect(storage.get('hello')).to.equal(null);
      expect(storage.get('hallo')).to.equal(null);

      storage.set('hello', 'world');
      storage.set('hallo', 'welt');
      storage.clear();

      expect(storage.get('hello')).to.equal(null);
      expect(storage.get('hallo')).to.equal(null);
    });

    it('should ignore values outside its scope', () => {
      const scopedStorage = new CookieStorage('my.scope');

      expect(storage.get('hello')).to.equal(null);
      expect(scopedStorage.get('hallo')).to.equal(null);

      storage.set('hello', 'world');
      scopedStorage.set('hallo', 'welt');

      scopedStorage.clear();

      expect(storage.get('hello')).to.equal('world');
      expect(scopedStorage.get('hallo')).to.equal(null);
    });
  });
});
