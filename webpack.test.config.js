const config = require('./webpack.config.js');

config.output = { pathinfo: true };
config.mode = 'development';
config.devtool = 'inline-source-map';
config.optimization = { minimize: false };
config.module.rules.push({
  enforce: 'pre',
  test: /\.js$/,
  exclude: /tests|node_modules/,
  use: {
    loader: 'istanbul-instrumenter-loader',
    options: { esModules: true }
  }
});

module.exports = config;
