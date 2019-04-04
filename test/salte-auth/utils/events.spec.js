const { describe, it, before, after } = intern.getPlugin('interface.bdd');

import sinon from 'sinon';

import { Events } from '../../../src/utils/events';

describe('Utils.Events', () => {
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
});
