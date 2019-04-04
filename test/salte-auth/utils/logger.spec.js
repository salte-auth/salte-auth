const { describe, it, beforeEach, afterEach } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

import sinon from 'sinon';

import { Logger } from '../../../src/utils/logger';

describe('Utils.Logger', () => {
  beforeEach(() => {
    sinon.spy(console, 'log');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('function(trace)', () => {
    it('should log if the level is trace', () => {
      const logger = new Logger('example', 'trace');

      logger.trace('this is a test');

      expect(console.log.callCount).to.equal(1);
      expect(console.log.firstCall.args[0]).to.equal('trace: this is a test');
    });

    it(`shouldn't log if the level is anything but trace`, () => {
      const logger = new Logger('example', 'error');

      logger.trace('this is a test');

      expect(console.log.callCount).to.equal(0);
    });
  });

  describe('function(info)', () => {
    it('should log if the level is info', () => {
      const logger = new Logger('example', 'info');

      logger.info('this is a test');

      expect(console.log.callCount).to.equal(1);
      expect(console.log.firstCall.args[0]).to.equal('info: this is a test');
    });

    it(`shouldn't log if the level is anything but info`, () => {
      const logger = new Logger('example', 'error');

      logger.info('this is a test');

      expect(console.log.callCount).to.equal(0);
    });
  });

  describe('function(warn)', () => {
    it('should log if the level is warn', () => {
      const logger = new Logger('example', 'warn');

      logger.warn('this is a test');

      expect(console.log.callCount).to.equal(1);
      expect(console.log.firstCall.args[0]).to.equal('warn: this is a test');
    });

    it(`shouldn't log if the level is anything but warn`, () => {
      const logger = new Logger('example', 'error');

      logger.warn('this is a test');

      expect(console.log.callCount).to.equal(0);
    });
  });

  describe('function(error)', () => {
    it('should log if the level is error', () => {
      const logger = new Logger('example', 'error');

      logger.error('this is a test');

      expect(console.log.callCount).to.equal(1);
      expect(console.log.firstCall.args[0]).to.equal('error: this is a test');
    });

    it(`shouldn't log if the level is anything but error`, () => {
      const logger = new Logger('example', false);

      logger.error('this is a test');

      expect(console.log.callCount).to.equal(0);
    });
  });
});
