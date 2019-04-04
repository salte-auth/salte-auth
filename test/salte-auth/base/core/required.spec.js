const { describe, it } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { SalteAuthError } from '../../../../src/base/core/salte-auth-error';
import { Required } from '../../../../src/base/core/required';

describe('Required', () => {
  describe('function(required)', () => {
    it(`should throw an error if required properties aren't provided`, () => {
      class Example extends Required {
        constructor(config) {
          super(config);

          this.required('hello');
        }
      }

      expect(() => new Example({})).to.throw(SalteAuthError);
    });

    it(`should pass if the required property is given`, () => {
      class Example extends Required {
        constructor(config) {
          super(config);

          this.required('hello');
        }
      }

      expect(() => new Example({
        hello: 'world'
      })).to.not.throw(SalteAuthError);
    });
  });
});
