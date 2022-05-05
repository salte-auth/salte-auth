import { expect } from 'chai';

import { Dedupe } from '../../../src/utils/dedupe';

import { wait } from '../../utils/wait';

describe('Dedupe', () => {
  describe('function(dedupe)', () => {
    it('should dedupe multiple requests', async () => {
      const dedupe = Dedupe.dedupe();

      const promise = dedupe('my-key', async () => {
        await wait(100);

        return 'hello';
      });

      const otherPromise = dedupe('my-key', async () => {
        await wait(100);

        return 'world';
      });

      expect(promise).equals(otherPromise);

      expect(await promise).equals('hello');
    });

    it('should clean up previous promises upon finishing', async () => {
      const dedupe = Dedupe.dedupe();

      const promise = dedupe('my-key', async () => {
        await wait(100);

        return 'hello';
      });

      expect(await promise).equals('hello');

      const otherPromise = dedupe('my-key', async () => {
        await wait(100);

        return 'world';
      });

      expect(await otherPromise).equals('world');
    });
  });
});
