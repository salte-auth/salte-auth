import { expect } from 'chai';
import sinon from 'sinon';

import { AuthMixinGenerator } from '../../../src/mixins/auth';

describe('AuthMixinGenerator', () => {
  let auth, events;
  beforeEach(() => {
    events = {};
    auth = {
      on: sinon.stub().callsFake((type, cb) => {
        events[type] = events[type] || [];
        events[type].push(cb);
      })
    };
  });

  it('should support enhancing a base class', () => {
    const mixin = AuthMixinGenerator(auth);

    class Base {}
    class MyElement extends mixin(Base) {}

    const element = new MyElement();

    expect(element.auth).to.equal(auth);
    expect(auth.on.callCount).to.equal(2);
    expect(events.login.length).to.equal(1);
    expect(events.logout.length).to.equal(1);
  });

  it('should support "requestUpdate" being defined', () => {
    const mixin = AuthMixinGenerator(auth);

    class Base {}
    Base.prototype.requestUpdate = sinon.stub();

    class MyElement extends mixin(Base) {}

    const element = new MyElement();

    expect(events.login.length).to.equal(1);
    expect(events.logout.length).to.equal(1);

    events.login[0]();
    events.logout[0]();
    expect(element.requestUpdate.callCount).to.equal(2);
  });

  it('should support "requestUpdate" not being defined', () => {
    const mixin = AuthMixinGenerator(auth);

    class Base {}
    class MyElement extends mixin(Base) {}

    new MyElement();

    expect(events.login.length).to.equal(1);
    expect(events.logout.length).to.equal(1);

    events.login[0]();
    events.logout[0]();
  });
});
