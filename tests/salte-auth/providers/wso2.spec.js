import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';
import wso2 from '../../../src/providers/wso2.js';

describe('wso2', () => {
  const utilities = new SalteAuthUtilities();

  describe('function(deauthorizeUrl)', () => {
    it('should create a logout url', () => {
      const url = wso2.deauthorizeUrl.call({ $utilities: utilities }, {
        providerUrl: 'https://api.salte.io',
        redirectUrl: `${location.protocol}//${location.host}`,
        relyingParty: 'test123'
      });
      expect(url).to.equal(`https://api.salte.io/commonauth?commonAuthLogout=true&type=oidc&commonAuthCallerPath=${encodeURIComponent(`${location.protocol}//${location.host}`)}&relyingParty=test123`);
    });

    it('should support a separate logoutUrl', () => {
      const url = wso2.deauthorizeUrl.call({ $utilities: utilities }, {
        providerUrl: 'https://api.salte.io',
        redirectUrl: {
          logoutUrl: `${location.protocol}//${location.host}`
        },
        relyingParty: 'test123'
      });
      expect(url).to.equal(`https://api.salte.io/commonauth?commonAuthLogout=true&type=oidc&commonAuthCallerPath=${encodeURIComponent(`${location.protocol}//${location.host}`)}&relyingParty=test123`);
    });
  });
});
