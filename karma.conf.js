const webpackConfig = require('./webpack.test.config.js');
webpackConfig.module.loaders[0].query = {
  presets: [
    "es2015"
  ],
  plugins: [
    ['istanbul', {
      exclude: [
        '**/*.spec.js'
      ]
    }]
  ]
};

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: [
      'mocha',
      'sinon'
    ],

    files: [
      'tests/**/*.spec.js'
    ],

    preprocessors: {
      'tests/**/*.spec.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    },

    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'text' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' }
      ]
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['PhantomJS'],

    browserNoActivityTimeout: 120000,

    singleRun: false
  });
};
