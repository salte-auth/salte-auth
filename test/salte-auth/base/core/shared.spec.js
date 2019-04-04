const { describe, it } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { Shared } from '../../../../src/base/core/shared';

describe('Shared', () => {
  describe('constructor', () => {
    it(`should default redirectUrl to 'location.origin'`, () => {
      class Example extends Shared {};

      const example = new Example();

      expect(example.config.redirectUrl).to.equal(`${location.protocol}//${location.host}`);
    });
  });

  describe('function(redirectUrl)', () => {
    it('should support a generic redirect url', () => {
      class Example extends Shared {};

      const example = new Example();

      expect(example.redirectUrl('login')).to.equal(`${location.protocol}//${location.host}`);
      expect(example.redirectUrl('logout')).to.equal(`${location.protocol}//${location.host}`);
    });

    it('should support different redirect urls for login and logout', () => {
      class Example extends Shared {};

      const example = new Example({
        redirectUrl: {
          login: 'https://google.com/login',
          logout: 'https://google.com/logout',
        }
      });

      expect(example.redirectUrl('login')).to.equal(`https://google.com/login`);
      expect(example.redirectUrl('logout')).to.equal(`https://google.com/logout`);
    });
  });
});
