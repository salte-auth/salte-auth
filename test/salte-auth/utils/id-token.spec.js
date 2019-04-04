const { describe, it } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { encode } from 'universal-base64url';

import { IDToken } from '../../../src/utils/id-token';

describe('Utils.IDToken', () => {
  describe('function(parse)', () => {
    it('should parse the "id_token"', () => {
      const user = IDToken.parse(`0.${btoa(
        JSON.stringify({
          sub: '1234567890',
          name: 'John Doe'
        })
      )}.0`);

      expect(user).to.deep.equal({
        sub: '1234567890',
        name: 'John Doe'
      });
    });

    it('should support decoding base64 url encoded tokens', () => {
      const user = IDToken.parse(`0.${encode(
        JSON.stringify({
          'name': 'John Doe',
          'picture': 'https://s.gravatar.com/avatar/f944c2c12cc848203329ee871f6a5d5b?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fni.png'
        })
      )}.0`);

      expect(user).to.deep.equal({
        'name': 'John Doe',
        'picture': 'https://s.gravatar.com/avatar/f944c2c12cc848203329ee871f6a5d5b?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fni.png'
      });
    });

    it('should return null if "id_token" does not have three parts', () => {
      expect(IDToken.parse('0.0')).to.equal(null);
    });

    it('should return null if the "id_token" is undefined', () => {
      expect(IDToken.parse()).to.equal(null);
    });
  });
});
