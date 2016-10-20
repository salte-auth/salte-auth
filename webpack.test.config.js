const ci = process.env.CI === 'true';

module.exports = {
  output: {
    pathinfo: true
  },
  module: {
    preLoaders: [{
      test: /\.js$/,
      include: /tests/,
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
  eslint: {
    emitError: ci,
    failOnError: ci
  },
  devtool: 'inline-source-map'
};
