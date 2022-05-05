import { expect } from 'chai';

import { CookieStorage } from '../../../../src/utils/storage';

describe('Storage', () => {
  const storage = new CookieStorage();

  beforeEach(() => {
    storage.clear();
  });

  describe('function(has)', () => {
    it('should support defined values', () => {
      storage.set('hello', 'world');

      expect(storage.has('hello')).to.equal(true);
    });

    it('should support undefined values', () => {
      expect(storage.has('hello')).to.equal(false);
    });
  });

  describe('function(key)', () => {
    it('should support providing a key', () => {
      expect(storage.key('hello')).to.equal('hello');
    });

    it('should support not providing a key', () => {
      expect(storage.key()).to.equal('');
    });

    it('should support scoped keys', () => {
      const scopedStorage = new CookieStorage('scoped');

      expect(scopedStorage.key('hello')).to.equal('scoped.hello');
    });

    it('should support getting the base key', () => {
      const scopedStorage = new CookieStorage('scoped');

      expect(scopedStorage.key()).to.equal('scoped.');
    });
  });
});
