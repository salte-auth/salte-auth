import { expect } from 'chai';

import { Provider } from '../../../../src/base/core/provider';

describe('Provider', () => {
  describe('getter($name)', () => {
    it(`should return the default name`, () => {
      class Example extends Provider {
        get name() {
          return 'example';
        }
      };

      const example = new Example();

      expect(example.$name).to.equal('example');
    });

    it(`should return the custom name`, () => {
      class Example extends Provider {
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

  describe('function(validation)', () => {
    it(`should default validation to true`, () => {
      class Example extends Provider {
        constructor(options) {
          super(options);

          expect(this.validation('hello')).to.equal(true);
        }
      };

      new Example();
    });

    it(`should support validation being false`, () => {
      class Example extends Provider {
        constructor(options) {
          super(options);

          expect(this.validation('hello')).to.equal(false);
        }
      };

      new Example({
        validation: false
      });
    });

    it(`should support validation being an object`, () => {
      class Example extends Provider {
        constructor(options) {
          super(options);

          expect(this.validation('hello')).to.equal(true);
          expect(this.validation('hallo')).to.equal(false);
        }
      };

      new Example({
        validation: {
          hello: true
        }
      });
    });
  });

  describe('function(key)', () => {
    it(`should scope the local / session storage to 'providers.{name}'`, () => {
      class Example extends Provider {
        get name() {
          return 'example';
        }

        constructor(options) {
          super(options);

          expect(this.key('hello')).to.equal('salte.auth.provider.example.hello');
        }
      };

      new Example();
    });
  });

  describe('function(url)', () => {
    it(`should support building a url`, () => {
      class Example extends Provider {
        constructor(options) {
          super(options);

          expect(this.url('https://google.com', {
            hello: 'world',
            hallo: 'welt'
          })).to.equal('https://google.com?hello=world&hallo=welt');
        }
      };

      new Example();
    });

    it(`should ignore undefined, null, and empty values`, () => {
      class Example extends Provider {
        constructor(options) {
          super(options);

          expect(this.url('https://google.com', {
            hello: undefined,
            hallo: null,
            example: ''
          })).to.equal('https://google.com');
        }
      };

      new Example();
    });

    it(`should support adding to a url with query params`, () => {
      class Example extends Provider {
        constructor(options) {
          super(options);

          expect(this.url('https://google.com?hello=world', {
            hallo: 'welt'
          })).to.equal('https://google.com?hello=world&hallo=welt');
        }
      };

      new Example();
    });

    it(`should support not providing params`, () => {
      class Example extends Provider {
        constructor(options) {
          super(options);

          expect(this.url('https://google.com')).to.equal('https://google.com');
        }
      };

      new Example();
    });
  });
});
