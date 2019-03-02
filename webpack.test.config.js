module.exports = {
  output: {
    pathinfo: true
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules\/(?!(@webcomponents\/shadycss|lit-html|lit-element|@polymer)\/).*/,
      options: {
        cacheDirectory: true
      }
    }]
  },
  mode: 'development',
  devtool: 'inline-source-map',
  optimization: {
    minimize: false
  },
  resolve: {
    alias: {
      debug: 'debug/dist/debug.js'
    }
  }
};
