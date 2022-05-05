import { Utils } from '@salte-auth/salte-auth';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { IFrame } from '../../src/iframe';

chai.use(sinonChai);
const { expect } = chai;

describe('IFrame', () => {
  /** @type {IFrame} */
  let iframe;
  beforeEach(() => {
    sinon.stub(parent.document, 'querySelector').returns('world');
    sinon.stub(parent.document.body, 'removeChild');

    iframe = new IFrame();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getter(name)', () => {
    it('should default the name to "iframe"', () => {
      expect(iframe.$name).to.equal('iframe');
    });
  });

  describe('getter(auto)', () => {
    it('should support automatic login', () => {
      expect(iframe.auto).to.equal(true);
    });
  });

  describe('function(open)', () => {
    it('should login via an iframe', async () => {
      sinon.stub(Utils.Common, 'iframe').returns(Promise.resolve());

      await iframe.open({
        url: 'https://google.com',
        redirectUrl: 'https://github.com'
      });

      expect(Utils.Common.iframe).calledWith({
        url: 'https://google.com',
        redirectUrl: 'https://github.com',
        visible: true
      });
    });

    it('should support errors', async () => {
      sinon.stub(Utils.Common, 'iframe').returns(Promise.reject('Whoops!'));

      const error = await iframe.open({
        url: 'https://google.com',
        redirectUrl: 'https://github.com',
        visible: true
      }).catch((error) => error);

      expect(error).to.equal('Whoops!');
    });
  });
});
