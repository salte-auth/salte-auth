import { expect } from 'chai';

import { Events } from '../../../../src/base/core/events';

describe('Events', () => {
  describe('function(on)', () => {
    it('should support listening for events', () => {
      class Example extends Events {}

      const example = new Example();

      return new Promise((resolve) => {
        example.on('hello', resolve);
        example.emit('hello');
      });
    });

    it('should support listening for the same event multiple times', () => {
      class Example extends Events {}

      const example = new Example();

      const promises = [];

      promises.push(new Promise((resolve) => example.on('hello', resolve)));
      promises.push(new Promise((resolve) => example.on('hello', resolve)));

      example.emit('hello');

      return promises;
    });
  });

  describe('function(off)', () => {
    it('should support unregistering a listener', () => {
      class Example extends Events {}

      const example = new Example();

      return new Promise((resolve, reject) => {
        example.on('hello', reject);
        example.off('hello', reject);
        example.emit('hello');
        resolve();
      });
    });

    it(`should ignore if there aren't any listeners to unregister`, () => {
      class Example extends Events {}

      const example = new Example();

      example.off('hello', () => {});
    });

    it(`should ignore multiple calls to unregister the same listener`, () => {
      class Example extends Events {}

      const example = new Example();

      return new Promise((resolve, reject) => {
        example.on('hello', reject);
        example.off('hello', reject);
        example.off('hello', reject);
        example.emit('hello');
        resolve();
      });
    });

    it(`should ignore calls for listeners that don't exist`, () => {
      class Example extends Events {}

      const example = new Example();

      return new Promise((resolve) => {
        example.on('hello', resolve);
        example.off('hello', () => {});
        example.emit('hello');
      });
    });
  });

  describe('function(emit)', () => {
    it('should support emitting data', () => {
      class Example extends Events {}

      const example = new Example();

      return new Promise((resolve) => {
        example.on('hello', (world) => {
          expect(world).to.equal('world');
          resolve();
        });
        example.emit('hello', 'world');
      });
    });

    it('should support emitting multiple data arguments', () => {
      class Example extends Events {}

      const example = new Example();

      return new Promise((resolve) => {
        example.on('hello', (world, hallo, welt) => {
          expect(world).to.equal('world');
          expect(hallo).to.equal('hallo');
          expect(welt).to.equal('welt');
          resolve();
        });
        example.emit('hello', 'world', 'hallo', 'welt');
      });
    });

    it('should support emitting to events with no listeners', () => {
      class Example extends Events {}

      const example = new Example();

      example.emit('hello');
    });
  });
});
