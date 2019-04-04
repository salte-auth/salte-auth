const { describe, it, beforeEach, afterEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import sinon from 'sinon';

import { XHR } from '../../../../src/utils/interceptors/xhr';

describe('Utils.Interceptors@XHR', () => {
  beforeEach(() => {
    XHR.setup(true);
    sinon.spy(XHR, 'realOpen');
    sinon.spy(XHR, 'realSend');
  });

  afterEach(() => {
    sinon.restore();
    XMLHttpRequest.prototype.open = XHR.realOpen;
    XMLHttpRequest.prototype.send = XHR.realSend;
  });

  describe('function(add)', () => {
    it('should intercept XHR requests', async () => {
      XHR.add((request, data) => {
        expect(data).to.equal(undefined);
      });

      await new Promise((resolve) => {
        const request = new XMLHttpRequest();

        request.addEventListener('load', function() {
          expect(this.responseText).to.be.ok;
          expect(XHR.realOpen.callCount).to.equal(1);
          expect(XHR.realSend.callCount).to.equal(1);
          resolve();
        }, { passive: true });

        request.open('GET', `${location.protocol}//${location.host}/context.html`, false);
        request.send();
      });
    });

    it('should support rejected promises', async () => {
      XHR.add(() => Promise.reject('Stuff broke!'));

      await new Promise((resolve) => {
        const request = new XMLHttpRequest();

        request.addEventListener('error', event => {
          expect(event.detail).to.equal('Stuff broke!');
          expect(XHR.realOpen.callCount).to.equal(1);
          expect(XHR.realSend.callCount).to.equal(0);
          resolve();
        }, { passive: true });

        request.open('GET', `${location.protocol}//${location.host}/context.html`, false);
        request.send();
      });
    });
  });
});
