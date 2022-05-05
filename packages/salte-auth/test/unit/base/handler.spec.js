import { expect } from 'chai';

import { Handler } from '../../../src/base/handler';

describe('Handler', () => {
  describe('getter($name)', () => {
    it(`should return the default name`, () => {
      class Example extends Handler {
        get name() {
          return 'example';
        }
      };

      const example = new Example();

      expect(example.$name).to.equal('example');
    });

    it(`should return the custom name`, () => {
      class Example extends Handler {
        get name() {
          return 'example';
        }
      };

      const example = new Example({
        name: 'hello'
      });

      expect(example.$name).to.equal('hello');
    });
  });

  describe('function(key)', () => {
    it(`should scope the local / session storage to 'providers.{name}'`, () => {
      class Example extends Handler {
        get name() {
          return 'example';
        }

        constructor(options) {
          super(options);

          expect(this.key).to.equal('salte.auth.handler.example');
        }
      };

      new Example();
    });
  });
});
