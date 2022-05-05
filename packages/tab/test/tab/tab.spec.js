import { Utils } from '@salte-auth/salte-auth';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Tab } from '../../src/tab';

chai.use(sinonChai);
const { expect } = chai;

describe('Tab', () => {
  /** @type {Tab} */
  let tab;
  beforeEach(() => {
    sinon.stub(parent.document, 'querySelector').returns('world');
    sinon.stub(parent.document.body, 'removeChild');

    tab = new Tab();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('constructor', () => {
    it('should default the window configuration', () => {
      const tab = new Tab();

      expect(tab.config.window).to.deep.equal({
        name: '@salte-auth/tab'
      });
    });
  });

  describe('getter(name)', () => {
    it('should default the name to "tab"', () => {
      expect(tab.$name).to.equal('tab');
    });
  });

  describe('getter(auto)', () => {
    it('should support automatic login', () => {
      expect(tab.auto).to.equal(false);
    });
  });

  describe('function(open)', () => {
    let tabWindow;
    beforeEach(() => {
      tabWindow = {
        focus: sinon.stub(),
        close: () => tabWindow.closed = true,
        location: { href: 'https://google.com' }
      };
    });

    it('should support authenticating via a new tab', async () => {
      sinon.stub(window, 'open').returns(tabWindow);

      setTimeout(() => {
        tabWindow.location.href = location.href;
        tabWindow.location.search = `?hello=world&hallo=welt`;
      }, 100);

      const parsed = await tab.open({
        url: 'https://google.com',
        redirectUrl: location.href
      });

      expect(window.open).calledWith('https://google.com', '_blank');
      expect(parsed).to.deep.equal({
        hello: 'world',
        hallo: 'welt'
      });
    });

    it('should throw an error if it fails to open a new tab', async () => {
      sinon.stub(window, 'open').returns(null);

      const error = await tab.open({
        url: 'https://google.com',
        redirectUrl: location.href
      }).catch((error) => error);

      expect(error.code).to.equal('tab_blocked');
    });

    it('should support errors', async () => {
      sinon.stub(tabWindow, 'close').callsFake(() => {
        tabWindow.close.restore();
        throw new Error('Hello World!');
      });

      sinon.stub(window, 'open').returns(tabWindow);

      setTimeout(() => {
        tabWindow.location.href = location.href;
        tabWindow.location.search = `?hello=world&hallo=welt`;
      }, 100);

      const error = await tab.open({
        url: 'https://google.com',
        redirectUrl: location.href
      }).catch((error) => error);

      expect(error).to.be.an.instanceOf(Error);
    });

    it('should ignore CrossDomainErrors', async () => {
      sinon.stub(tabWindow, 'close').callsFake(() => {
        throw new Error('Hello World!');
      });
      sinon.stub(window, 'open').returns(tabWindow);
      sinon.stub(Utils.Events, 'isCrossDomainError').returns(true);
      tabWindow.location.href = location.href;

      setTimeout(() => {
        tabWindow.close.restore();
      }, 200);

      await tab.open({
        url: location.href,
        redirectUrl: location.href
      });

      expect(Utils.Events.isCrossDomainError.callCount).to.equal(1);
    });
  });
});
