const common = require('./rollup.common.config.js');

module.exports = common({
  es6: false,
  minified: false,
  server: true
});
