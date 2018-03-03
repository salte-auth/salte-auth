import { expect } from 'chai';

import SalteAuthUtilities from '../../../src/salte-auth.utilities.js';

describe('function(addXHRInterceptor)', () => {
  let utilities;
  beforeEach(() => {
    utilities = new SalteAuthUtilities();
  });

  it('should intercept XHR requests', () => {
    const promises = [];
    promises.push(
      new Promise(resolve => {
        utilities.addXHRInterceptor((request, data) => {
          expect(data).to.be.undefined;
          resolve();
        });
      })
    );

    const request = new XMLHttpRequest();
    promises.push(
      new Promise(resolve => {
        request.addEventListener('load', function() {
          expect(this.responseText).to.contain(
            'This is the execution context.'
          );
          resolve();
        });
      })
    );

    request.open('GET', `${location.protocol}//${location.host}/context.html`, false);
    request.send();
    return Promise.all(promises);
  });

  it('should support rejected promises', () => {
    const promises = [];
    utilities.addXHRInterceptor((request, data) => {
      return Promise.reject('Stuff broke!');
    });

    const request = new XMLHttpRequest();
    promises.push(
      new Promise(resolve => {
        request.addEventListener('error', event => {
          expect(event.detail).to.equal('Stuff broke!');
          resolve();
        });
      })
    );
    request.open('GET', `${location.protocol}//${location.host}/context.html`, false);
    request.send();
    return Promise.all(promises);
  });
});
