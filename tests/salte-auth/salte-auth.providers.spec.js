import { expect } from 'chai';

import { Providers } from '../../src/salte-auth.providers.js';

describe('salte-auth.providers', () => {
  describe('getter(auth0)', () => {
    it('should return the auth0 provider', () => {
      expect(Providers.auth0).to.not.be.undefined;
    });
  });

  describe('getter(azure)', () => {
    it('should return the azure provider', () => {
      expect(Providers.azure).to.not.be.undefined;
    });
  });

  describe('getter(cognito)', () => {
    it('should return the cognito provider', () => {
      expect(Providers.cognito).to.not.be.undefined;
    });
  });

  describe('getter(wso2)', () => {
    it('should return the wso2 provider', () => {
      expect(Providers.wso2).to.not.be.undefined;
    });
  });
});
