import { expect } from 'chai';

import { SalteAuth } from '../../../src/salte-auth.js';
import wso2 from '../../../src/providers/wso2.js';

const auth = new SalteAuth({
  provider: 'wso2'
});

describe('wso2', () => {
  describe('function(deauthorizeUrl)', () => {
    it('should create a logout url', () => {
      const url = wso2.deauthorizeUrl.call(auth, {
        gateway: 'https://api.salte.io',
        redirectUrl: `${location.protocol}//${location.host}`,
        relyingParty: 'test123'
      });
      expect(url).to.equal(`https://api.salte.io/commonauth?commonAuthLogout=true&type=oidc&commonAuthCallerPath=${encodeURIComponent(`${location.protocol}//${location.host}`)}&relyingParty=test123`);
    });
  });
});
