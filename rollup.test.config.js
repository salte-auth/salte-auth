const common = require('./rollup.common.config.js');

module.exports = common({
  minified: false,
  es6: false,
  tests: true,
  coverage: true
})
