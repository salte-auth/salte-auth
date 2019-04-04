const { describe, it } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { URL } from '../../../src/utils/url';

describe('Utils.URL', () => {
  describe('function(resolve)', () => {
    it('should support site root urls', () => {
      expect(URL.resolve('https://google.com')).to.equal('https://google.com');
    });

    it('should support paths', () => {
      expect(URL.resolve('/api/test')).to.equal(
        `${location.protocol}//${location.host}/api/test`
      );
    });

    it('should support full urls', () => {
      expect(URL.resolve('https://api.salte.io/api/test')).to.equal(
        'https://api.salte.io/api/test'
      );
    });
  });

  describe('function(match)', () => {
    it('should support true', () => {
      const match = URL.match(location.href, true);

      expect(match).to.equal(true);
    });

    it('should support multiple values', () => {
      const match = URL.match('https://api.salte.io', [
        'https://google.com/api',
        'https://api.salte.io'
      ]);

      expect(match).to.equal(true);
    });

    it('should support strings', () => {
      const match = URL.match('https://google.com/api', [
        'https://google.com/api'
      ]);

      expect(match).to.equal(true);
    });

    it('should support relative strings', () => {
      const match = URL.match(
        `${location.protocol}//${location.host}/api`,
        ['/api']
      );

      expect(match).to.equal(true);
    });

    it('should support regular expressions', () => {
      const match = URL.match(location.href, [
        new RegExp(location.host)
      ]);

      expect(match).to.equal(true);
    });

    it('should return false if there are no matches', () => {
      const match = URL.match(location.href, []);

      expect(match).to.equal(false);
    });

    it('should support passing nothing', () => {
      const match = URL.match(location.href);

      expect(match).to.equal(false);
    });
  });

  describe('function(parse)', () => {
    it('should support parsing the query params', () => {
      const params = URL.parse({
        search: '?hello=world'
      });

      expect(params).to.deep.equal({
        hello: 'world'
      });
    });

    it('should support parsing the hash', () => {
      const params = URL.parse({
        hash: '#hello=world'
      });

      expect(params).to.deep.equal({
        hello: 'world'
      });
    });

    it('should support parsing the query params and hash', () => {
      const params = URL.parse({
        search: '?hello=world',
        hash: '#hallo=welt'
      });

      expect(params).to.deep.equal({
        hello: 'world',
        hallo: 'welt'
      });
    });
  });
});
