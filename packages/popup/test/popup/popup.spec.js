import { expect } from 'chai';
import sinon from 'sinon';
import { Utils } from '@salte-auth/salte-auth';
import { Popup } from '../../src/popup';

import { parseFeatures } from '../utils/parse-features';

describe('Popup', () => {
  /** @type {Popup} */
  let popup;
  beforeEach(() => {
    popup = new Popup();
    sinon.stub(popup, 'navigate');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('constructor', () => {
    it('should default the window configuration', () => {
      const popup = new Popup();

      expect(popup.config.window).to.deep.equal({
        name: '@salte-auth/popup',
        height: 600,
        width: 600
      });
    });
  });

  describe('getter(name)', () => {
    it('should default the name to "popup"', () => {
      expect(popup.$name).to.equal('popup');
    });
  });

  describe('getter(auto)', () => {
    it(`shouldn't support automatic login`, () => {
      expect(popup.auto).to.equal(false);
    });
  });

  describe('function(open)', () => {
    let popupWindow;
    beforeEach(() => {
      popupWindow = {
        focus: sinon.stub(),
        close: () => popupWindow.closed = true,
        location: { href: 'https://google.com' }
      };
    });

    it('should return the url parameters upon returning', async () => {
      sinon.stub(window, 'open').callsFake((url, name, rawFeatures) => {
        expect(url).to.equal('https://google.com');
        expect(name).to.equal('@salte-auth/popup');
        const { height, location, menubar, status, toolbar, width } = parseFeatures(rawFeatures);

        expect(height).to.equal('600');
        expect(location).to.equal('no');
        expect(menubar).to.equal('no');
        expect(status).to.equal('yes');
        expect(toolbar).to.equal('no');
        expect(width).to.equal('600');

        return popupWindow;
      });

      setTimeout(() => {
        popupWindow.location.href = location.href;
        popupWindow.location.search = `?hello=world&hallo=welt`;
      }, 100);

      const parsed = await popup.open({
        url: 'https://google.com',
        redirectUrl: location.href
      });

      expect(parsed).to.deep.equal({
        hello: 'world',
        hallo: 'welt'
      });
    });

    it('should throw an error if it fails to open a popup', async () => {
      sinon.stub(window, 'open').returns(null);

      const error = await popup.open({
        url: 'https://google.com',
        redirectUrl: location.href
      }).catch((error) => error);

      expect(error.code).to.equal('popup_blocked');
    });

    it('should support errors', async () => {
      sinon.stub(popupWindow, 'close').callsFake(() => {
        popupWindow.close.restore();
        throw new Error('Hello World!');
      });
      sinon.stub(window, 'open').returns(popupWindow);

      popupWindow.location.href = location.href;

      const promise = popup.open({
        url: location.href,
        redirectUrl: location.href
      });

      const error = await promise.catch((error) => error);

      expect(error).to.be.an.instanceOf(Error);
    });

    it('should ignore CrossDomainErrors', async () => {
      sinon.stub(popupWindow, 'close').callsFake(() => {
        throw new Error('Hello World!');
      });
      sinon.stub(window, 'open').returns(popupWindow);
      sinon.stub(Utils.Events, 'isCrossDomainError').returns(true);
      popupWindow.location.href = location.href;

      setTimeout(() => {
        popupWindow.close.restore();
      }, 200);

      await popup.open({
        url: location.href,
        redirectUrl: location.href
      });

      expect(Utils.Events.isCrossDomainError.callCount).to.equal(1);
    });
  });
});
