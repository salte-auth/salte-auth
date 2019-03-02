import { expect } from 'chai';
import { LitElement, html } from 'lit-element';

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

class MyLitElement extends mixin(LitElement) {
  render() {
    return html`
      <div>User: ${this.user && this.user.sub}</div>
      <div>Authenticated: ${this.authenticated}</div>
    `;
  }
}

customElements.define('my-lit-element', MyLitElement);

describe('mixin(lit-element)', () => {
  let element;
  beforeEach(() => {
    element = document.createElement('my-lit-element');
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
    return element.updateComplete.then(() => {
      expect(user.innerText).to.equal('User:');
      expect(authenticated.innerText).to.equal('Authenticated: true');
    });
  });

  it('should support updating bindings with lit-element', () => {
    auth.on;
    const [user, authenticated] = element.shadowRoot.querySelectorAll('div');

    expect(user.innerText).to.equal('User: 12345');
    expect(authenticated.innerText).to.equal('Authenticated: true');

    element.user = null;
    return element.updateComplete.then(() => {
      expect(user.innerText).to.equal('User:');
      expect(authenticated.innerText).to.equal('Authenticated: true');
    });
  });
});
