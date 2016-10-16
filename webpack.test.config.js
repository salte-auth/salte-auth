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
  devtool: 'inline-source-map'
};
