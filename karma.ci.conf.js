const webpackConfig = require('./webpack.test.config.js');

module.exports = function(config) {
  const customLaunchers = {
    ChromeBeta: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'beta'
    },
    Chrome: {
      base: 'SauceLabs',
      browserName: 'chrome'
    },
    Firefox: {
      base: 'SauceLabs',
      browserName: 'firefox'
    },
    Edge: {
      base: 'SauceLabs',
      browserName: 'microsoftedge'
    },
    InternetExplorer11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '11'
    },
    // Safari12: {
    //   base: 'SauceLabs',
    //   browserName: 'safari',
    //   version: '12'
    // },
    Safari11: {
      base: 'SauceLabs',
      browserName: 'safari',
      version: '11'
    },
    Safari10: {
      base: 'SauceLabs',
      browserName: 'safari',
      version: '10'
    }
  };

  const karmaConfig = {
    basePath: '',

    frameworks: [
      'mocha',
      'sinon'
    ],

    files: [
      'tests/index.js'
    ],

    preprocessors: {
      'tests/index.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true,
      stats: 'errors-only'
    },

    reporters: ['mocha', 'saucelabs'],

    mochaReporter: {
      output: 'minimal',
      showDiff: true
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    sauceLabs: {
      testName: 'salte-io/salte-auth',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      startConnect: false
    },

    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    captureTimeout: 0,
    browserNoActivityTimeout: 120000,

    singleRun: true
  };

  config.set(karmaConfig);
};
