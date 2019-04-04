const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { SalteAuthError } from '../../../../src/base/core/salte-auth-error';
import { Storage } from '../../../../src/base/core/storage';

describe('Storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  describe('getter(storage)', () => {
    it('should default to session storage', () => {
      sessionStorage.setItem('salte.auth.hello', 'world');

      class Example extends Storage {
        constructor(config) {
          super(config);

          expect(this.get('hello')).to.equal('world');
        }
      }

      new Example();
    });

    it('should support pulling from local storage', () => {
      localStorage.setItem('salte.auth.hello', 'world');

      class Example extends Storage {
        constructor(config) {
          super(config);

          expect(this.get('hello')).to.equal('world');
        }
      }

      new Example({ storage: 'local' });
    });

    it('should throw an error for invalid storage types', () => {
      class Example extends Storage {
        constructor(config) {
          super(config);

          this.storage;
        }
      }

      expect(() => new Example({ storage: 'indexeddb' })).to.throw(SalteAuthError);
    });
  });

  describe('function(set)', () => {
    it('should save to storage', () => {
      class Example extends Storage {}

      const example = new Example();

      expect(example.get('hello')).to.equal(null);
      example.set('hello', 'world');
      expect(example.get('hello')).to.equal('world');
    });

    it('should automatically clear the storage ', () => {
      class Example extends Storage {}

      const example = new Example();

      example.set('hello', 'world');
      example.set('hallo', 'welt');
      example.set('hello', null);
      example.set('hallo', undefined);
      expect(example.get('hello')).to.equal(null);
      expect(example.get('hallo')).to.equal(null);
    });
  });

  describe('function(clear)', () => {
    it('should clear an item from storage', () => {
      class Example extends Storage {}

      const example = new Example();

      example.set('hello', 'world');
      example.clear('hello');
      expect(sessionStorage.getItem('salte.auth.hello')).to.equal(null);
    });
  });

  describe('function(reset)', () => {
    it('should reset all items in the key scope for sessionStorage', () => {
      class Example extends Storage {}

      const example = new Example();

      sessionStorage.setItem('hallo', 'welt');
      example.set('hello', 'world');
      example.set('hallo', 'welt');
      example.reset();

      expect(sessionStorage.getItem('hallo')).to.equal('welt');
      expect(example.get('hello')).to.equal(null);
      expect(example.get('hallo')).to.equal(null);
    });

    it('should reset all items in the key scope for localStorage', () => {
      class Example extends Storage {}

      const example = new Example({ storage: 'local' });

      localStorage.setItem('hallo', 'welt');
      example.set('hello', 'world');
      example.set('hallo', 'welt');
      example.reset();

      expect(localStorage.getItem('hallo')).to.equal('welt');
      expect(example.get('hello')).to.equal(null);
      expect(example.get('hallo')).to.equal(null);
    });
  });
});
