module.exports = {
  output: {
    pathinfo: true
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      include: /node_modules(?:\/|\\)lit-element|lit-html/,
      loader: 'babel-loader'
    }, {
      test: /\.html$/,
      exclude: /node_modules/,
      loader: 'html-loader'
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
