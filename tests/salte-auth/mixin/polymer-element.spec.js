import { expect } from 'chai';
import { PolymerElement, html } from '@polymer/polymer';

import { SalteAuthMixinGenerator } from '../../../src/salte-auth.mixin.js';

const auth = {
  on: sinon.stub(),
  profile: {
    userInfo: {}
  }
};

sinon.stub(auth.profile, 'userInfo').get(() => {
  return { sub: '12345' };
});
const mixin = SalteAuthMixinGenerator(auth);

class MyPolymerElement extends mixin(PolymerElement) {
  static get template() {
    return html`
      <div>User: [[user.sub]]</div>
      <div>Authenticated: [[authenticated]]</div>
    `;
  }
}

customElements.define('my-polymer-element', MyPolymerElement);

describe('mixin(polymer-element)', () => {
  let element;
  beforeEach(() => {
    element = document.createElement('my-polymer-element');
    document.body.appendChild(element);

    return element.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should support updating bindings with lit-element', () => {
    const [user, authenticated] = element.shadowRoot.querySelectorAll('div');

    expect(user.innerText).to.equal('User: 12345');
    expect(authenticated.innerText).to.equal('Authenticated: true');

    element.user = null;

    expect(user.innerText).to.equal('User:');
    expect(authenticated.innerText).to.equal('Authenticated: true');
  });
});
