import { expect } from 'chai';
import sinon from 'sinon';
import { Redirect } from '../../src/redirect';

describe('Redirect', () => {
  /** @type {Redirect} */
  let redirect;
  beforeEach(() => {
    redirect = new Redirect();
    sinon.stub(redirect, 'navigate');
  });

  describe('getter(name)', () => {
    it('should default the name to "redirect"', () => {
      expect(redirect.$name).to.equal('redirect');
    });
  });

  describe('getter(auto)', () => {
    it('should support automatic login', () => {
      expect(redirect.auto).to.equal(true);
    });
  });

  describe('function(connected)', () => {
    it('should support logging in', async () => {
      sinon.stub(redirect.storage, 'get').returns('https://google.com');

      const parsed = redirect.connected({
        action: 'login'
      });

      expect(redirect.navigate.callCount).to.equal(1);
      expect(parsed).to.deep.equal({});
    });

    it('should support logging out', async () => {
      sinon.stub(redirect.storage, 'get').returns('https://google.com');

      const parsed = redirect.connected({
        action: 'logout'
      });

      expect(redirect.navigate.callCount).to.equal(0);
      expect(parsed).to.equal(undefined);
    });

    it(`should bail if we aren't the active handler`, async () => {
      sinon.stub(redirect.storage, 'get').returns('https://google.com');

      await redirect.connected({
        action: null
      });

      expect(redirect.navigate.callCount).to.equal(0);
    });

    it(`should bail if we don't have an origin`, async () => {
      sinon.stub(redirect.storage, 'get').returns(null);

      await redirect.connected({
        action: 'login'
      });

      expect(redirect.navigate.callCount).to.equal(0);
    });
  });

  describe('function(open)', () => {
    it('should redirect the user to the given url', () => {
      redirect.open({
        url: 'https://google.com'
      });

      expect(redirect.storage.get('origin')).to.equal(location.href);
      expect(redirect.navigate.callCount).to.equal(1);
    });

    it('should support timing out', async () => {
      const error = await redirect.open({
        url: 'https://google.com',
        timeout: 0
      }).catch((error) => error);

      expect(error).to.be.an.instanceOf(Error);
      expect(error.code).to.equal('redirect_timeout');
    });
  });
});
