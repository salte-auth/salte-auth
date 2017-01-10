const ci = process.env.CI === 'true';

module.exports = {
  output: {
    pathinfo: true
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      include: /tests/,
      loader: 'eslint-loader',
      options: {
        emitError: ci,
        failOnError: ci
      }
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.html$/,
      exclude: /node_modules/,
      loader: 'html-loader'
    }]
  },
  devtool: 'inline-source-map'
};
