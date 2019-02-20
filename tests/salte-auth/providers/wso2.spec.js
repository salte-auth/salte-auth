import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';
import wso2 from '../../../src/providers/wso2.js';

describe('wso2', () => {
  const utilities = new SalteAuthUtilities();

  describe('function(deauthorizeUrl)', () => {
    it('should create a logout url', () => {
      const url = new URL(wso2.deauthorizeUrl.call({ $utilities: utilities }, {
        providerUrl: 'https://api.salte.io',
        redirectUrl: `${location.protocol}//${location.host}`,
        relyingParty: 'test123'
      }));

      expect(url.origin + url.pathname).to.equal('https://api.salte.io/commonauth');
      expect(url.searchParams.get('commonAuthLogout')).to.equal('true');
      expect(url.searchParams.get('type')).to.equal('oidc');
      expect(url.searchParams.get('relyingParty')).to.equal('test123');
      expect(url.searchParams.get('commonAuthCallerPath')).to.equal(`${location.protocol}//${location.host}`);
    });

    it('should support a separate logoutUrl', () => {
      const url = new URL(wso2.deauthorizeUrl.call({ $utilities: utilities }, {
        providerUrl: 'https://api.salte.io',
        redirectUrl: {
          logoutUrl: `${location.protocol}//${location.host}`
        },
        relyingParty: 'test123'
      }));

      expect(url.origin + url.pathname).to.equal('https://api.salte.io/commonauth');
      expect(url.searchParams.get('commonAuthLogout')).to.equal('true');
      expect(url.searchParams.get('type')).to.equal('oidc');
      expect(url.searchParams.get('relyingParty')).to.equal('test123');
      expect(url.searchParams.get('commonAuthCallerPath')).to.equal(`${location.protocol}//${location.host}`);
    });
  });
});
