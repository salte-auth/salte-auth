const path = require('path');
const webpack = require('webpack');
const deindent = require('deindent');
const { name, version, contributors } = require('./package.json');

module.exports = function({ minified, es6, coverage, test }) {
  return {
    context: path.join(__dirname, 'src'),
    entry: {
      'salte-auth': ['./salte-auth.js']
    },
    mode: 'none',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: `[name]${es6 ? '.es6' : ''}${minified ? '.min' : ''}.js`,
      sourceMapFilename: '[file].map',
      library: 'salte.auth',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    devtool: test ? 'inline-source-map' : 'source-map',
    module: {
      rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules\/(?!(whatwg-url|@webcomponents|lit-html|lit-element|@polymer)\/).*/,
        options: {
          presets: [['@babel/preset-env', {
            modules: false,
            targets: es6 ? {
              esmodules: true
            } : {
              browsers: [
                'last 2 chrome versions',
                'last 2 firefox versions',
                'last 2 edge versions',
                'IE >= 10',
                'Safari >= 7'
              ]
            }
          }]]
        }
      }].concat(coverage ? [{
        enforce: 'pre',
        test: /\.js$/,
        exclude: /tests|node_modules/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true }
        }
      }] : [])
    },
    optimization: {
      minimize: minified ? true : false
    },
    resolve: {
      alias: {
        debug: 'debug/dist/debug.js'
      }
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: deindent(`
          /**
           * ${name} JavaScript Library v${version}
           *
           * @license MIT (https://github.com/salte-auth/salte-auth/blob/master/LICENSE)
           *
           * Made with ♥ by ${contributors.join(', ')}
           */
        `).trim(),
        raw: true
      })
    ]
  };
};
