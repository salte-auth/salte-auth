const common = require('./rollup.common.config.js');

module.exports = [
  common({
    minified: true,
    es6: false
  }),

  common({
    minified: false,
    es6: false
  }),

  common({
    minified: true,
    es6: true
  }),

  common({
    minified: false,
    es6: true
  })
]
