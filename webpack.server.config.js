const config = require('./webpack.config.js');

config.module.rules.push({
  test: /\.html$/,
  exclude: /node_modules/,
  loader: 'html-loader'
});
config.externals = [];
config.entry['salte-auth'] = ['../index.html', '../index.js'];
config.devtool = 'inline-source-map';
config.devServer = {
  host: '0.0.0.0',
  port: '8081',
  historyApiFallback: true,
  disableHostCheck: true
};

module.exports = config;
