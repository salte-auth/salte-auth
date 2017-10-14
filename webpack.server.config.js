const config = require('./webpack.config.js');

config.externals = [];
config.entry['salte-auth'].push('../index.html');
config.devtool = 'inline-source-map';
config.devServer = {
  host: '0.0.0.0',
  historyApiFallback: true,
  disableHostCheck: true
};

module.exports = config;
