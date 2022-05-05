import { expect } from 'chai';
import sinon from 'sinon';

import { SalteAuthError } from '../../../../src/base/core/salte-auth-error';
import { LocalStorage, SessionStorage, CookieStorage } from '../../../../src/utils/storage';

import { Storage } from '../../../../src/base/core/storage';

describe('Storage', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('constructor', () => {
    it('should default to CookieStorage if cookies are supported', () => {
      sinon.stub(CookieStorage, 'supported').returns(true);

      class Example extends Storage {}

      const example = new Example();

      expect(example.storage).to.be.an.instanceOf(CookieStorage);
    });

    it('should default to SessionStorage if cookies are not supported', () => {
      sinon.stub(CookieStorage, 'supported').returns(false);

      class Example extends Storage {}

      const example = new Example();

      expect(example.storage).to.be.an.instanceOf(SessionStorage);
    });

    it('should support pulling from LocalStorage', () => {
      class Example extends Storage {}

      const example = new Example({ storage: 'local' });

      expect(example.storage).to.be.an.instanceOf(LocalStorage);
    });

    it('should support pulling from SessionStorage', () => {
      class Example extends Storage {}

      const example = new Example({ storage: 'session' });

      expect(example.storage).to.be.an.instanceOf(SessionStorage);
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
});
