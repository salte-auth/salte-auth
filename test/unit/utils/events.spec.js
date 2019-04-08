import sinon from 'sinon';
import { expect } from 'chai';

import { Events } from '../../../src/utils/events';

describe('Events', () => {
  let events = {};
  before(() => {
    sinon.stub(window, 'addEventListener').callsFake((name, listener) => {
      events[name] = events[name] || [];
      events[name].push(listener);
    });
  });

  after(() => {
    sinon.restore();
  });

  describe('function(route)', () => {
    it('should invoke route listener after setup', () => {
      return new Promise((resolve) => {
        Events.route(resolve);
      });
    });

    it('should invoke route listener on "popstate"', () => {
      return new Promise((resolve) => {
        Events.route(resolve);

        events.popstate.forEach((listener) => listener());
      });
    });

    it('should invoke route listener on "click"', () => {
      return new Promise((resolve) => {
        Events.route(resolve);

        events.click.forEach((listener) => listener());
      });
    });
  });

  describe('function(create)', () => {
    it('should create an event', () => {
      const e = Events.create('hello', {
        detail: 'world'
      });

      expect(e.type).to.equal('hello');
      expect(e.detail).to.equal('world');
      expect(e.bubbles).to.equal(false);
      expect(e.cancelable).to.equal(true);
    });
  });

  describe('function(isCrossDomainError)', () => {
    // TODO: IE 11 and Edge don't allow us to create this Exception
    // it('should return true if it is a DOMException', () => {
    //   new DOMException('Hello World');
    //   expect(Events.isCrossDomainError(new DOMException())).to.equal(true);
    // });

    it('should return true if the message contains "Permission denied"', () => {
      expect(Events.isCrossDomainError(new Error('Permission denied'))).to.equal(true);
    });

    it('should return false for generic errors', () => {
      expect(Events.isCrossDomainError(new Error('Hello world!'))).to.equal(false);
    });
  });
});
