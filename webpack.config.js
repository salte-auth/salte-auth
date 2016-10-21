const path = require('path');
const webpack = require('webpack');
const deindent = require('deindent');
const packageJson = require('./package.json');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './salte-auth.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'salte-auth.js',
    sourceMapFilename: '[file].map',
    library: 'salte-auth',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: [{
    'uuid': {
      root: 'uuid',
      commonjs2: 'uuid',
      commonjs: 'uuid',
      amd: 'uuid'
    }
  }],
  devtool: 'source-map',
  module: {
    preLoaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint'
    }],
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.html$/,
      exclude: /node_modules/,
      loader: 'html'
    }]
  },
  plugins: [
    new webpack.BannerPlugin(deindent(`
      /**
       * ${packageJson.name} JavaScript Library v${packageJson.version}
       *
       * @license MIT (https://github.com/salte-io/salte-auth/blob/master/LICENSE)
       *
       * Made with ♥ by ${packageJson.contributors.join(', ')}
       */
    `).trim(), {raw: true})
  ]
};
