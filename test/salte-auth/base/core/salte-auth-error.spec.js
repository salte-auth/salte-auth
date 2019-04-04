const { describe, it } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import { SalteAuthError } from '../../../../src/base/core/salte-auth-error';

describe('SalteAuthError', () => {
  it('should require a code and message to be provided', () => {
    const error = new SalteAuthError({
      code: 'something',
      message: 'uh oh!'
    });

    expect(error.code).to.equal('something');
    expect(error.message).to.equal('uh oh!');
  });
});
