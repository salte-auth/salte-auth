import { expect } from 'chai';

const { LitElement, html: litHtml } = require('lit-element');
// const { PolymerElement, html: polymerHtml } = require('@polymer/polymer');

import { SalteAuthMixinGenerator } from '../../src/salte-auth.mixin.js';

describe('salte-auth.mixin', () => {
  let auth, mixin;
  beforeEach(() => {
    auth = {
      on: sinon.stub().returns(),
      profile: {
        userInfo: {}
      }
    };

    sinon.stub(auth.profile, 'userInfo').get(() => {
      return {};
    });
    mixin = SalteAuthMixinGenerator(auth);
  });

  describe('function(generator)', () => {
    it('should create a mixin', () => {
      expect(auth.on.callCount).to.equal(3);
      expect(typeof(mixin)).to.equal('function');
    });

    it('should support being mixed with a class', () => {
      class Test {}
      class MyElement extends mixin(Test) {}

      const element = new MyElement();
      expect(element.auth).to.equal(auth);
    });
  });

  describe('mixin(lit-element)', () => {
    let element;
    beforeEach(() => {
      class MyLitElement extends mixin(LitElement) {
        render() {
          return litHtml`
            <style>
              :host {
                display: block;
              }
            </style>
            <h1>Lit</h1>
            <div>User: ${this.user && this.user.sub}</div>
            <div>Authenticated: ${this.authenticated}</div>
          `;
        }
      }

      customElements.define('my-lit-element', MyLitElement);
      element = document.createElement('my-lit-element');
      document.body.appendChild(element);
    });

    afterEach(() => {
      document.body.removeChild(element);
    });

    it('should support updating bindings with lit-element', () => {
      expect(element.auth).to.equal(auth);
    });
  });
});


// class MyPolymerElement extends auth.mixin(PolymerElement) {
//   static get template() {
//     return polymerHtml`
//       <style>
//         :host {
//           display: block;
//         }
//       </style>
//       <h1>Polymer</h1>
//       <div>User: [[user]]</div>
//       <div>Authenticated: [[authenticated]]</div>
//     `;
//   }
// }

// customElements.define('my-lit-element', MyLitElement);
// customElements.define('my-polymer-element', MyPolymerElement);
