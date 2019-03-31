const common = require('./rollup.common.config.js');

module.exports = (config) => {
  config.set({
    basePath: '',

    frameworks: [
      'mocha'
    ],

    files: [
      'test/index.js'
    ],

    preprocessors: {
      'test/index.js': ['rollup', 'sourcemap'],
    },

    rollupPreprocessor: common({
      minified: false,
      es6: false,
      tests: true,
      coverage: true
    }),

    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'text' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' }
      ]
    },

    mochaReporter: {
      showDiff: true
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['ChromeHeadless'],

    browserNoActivityTimeout: 120000,

    singleRun: false
  });
}
