const common = require('./webpack.common.config.js');

module.exports = [
  common({
    minified: true,
    es6: true
  }),

  common({
    minified: false,
    es6: true
  }),

  common({
    minified: true,
    es6: false
  }),

  common({
    minified: false,
    es6: false
  })
];
