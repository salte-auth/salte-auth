const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const glob = require('rollup-plugin-glob-import');
const babel = require('rollup-plugin-babel');
const deindent = require('deindent');
const { terser } = require('rollup-plugin-terser');
const replace = require('rollup-plugin-replace');
const serve = require('rollup-plugin-serve');
const copy = require('rollup-plugin-copy-assets-to');

const { name, contributors, version, browserslist } = require('./package.json');

module.exports = function({ minified, es6, tests, coverage, demo, server }) {
  demo = demo || server;

  return {
    input: demo ? 'demo/index.ts' : 'src/salte-auth.ts',
    external: [],
    output: {
      file: `dist/salte-auth${minified ? '.min' : ''}.${es6 ? 'mjs' : 'js'}`,
      format: es6 ? 'es' : 'umd',
      name: 'salte.auth',
      sourcemap: tests ? 'inline' : true,
      exports: 'named',
      banner: deindent`
        /**
         * ${name} JavaScript Library v${version}
         *
         * @license MIT (https://github.com/salte-auth/salte-auth/blob/master/LICENSE)
         *
         * Made with ♥ by ${contributors.join(', ')}
         */
      `
    },

    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),

      resolve({
        mainFields: ['browser', 'main'],

        extensions: [ '.mjs', '.js', '.jsx', '.json', '.ts' ]
      }),

      commonjs({
        namedExports: {
          'chai': [ 'expect' ]
        }
      }),
      glob(),

      babel({
        runtimeHelpers: true,

        presets: [
          '@babel/typescript',
          ['@babel/preset-env', {
            targets: es6 ? {
              esmodules: true
            } : {
              browsers: browserslist
            }
          }]
        ],

        plugins: [
          '@babel/proposal-class-properties',
          '@babel/proposal-object-rest-spread',
          ['@babel/plugin-transform-runtime', {
            regenerator: true
          }],
        ].concat(coverage ? [['istanbul', {
          include: [
            'src/**/*.ts'
          ]
        }]] : []),

        exclude: 'node_modules/!(chai-as-promised|chai|sinon|universal-base64url)/**',
        extensions: [".ts", ".js", ".jsx", ".es6", ".es", ".mjs"]
      }),

      minified && terser({
        output: {
          comments: function (node, comment) {
            const { value, type } = comment;
            if (type == 'comment2') {
              // multiline comment
              return /@license/i.test(value);
            }
          }
        }
      }),

      demo && copy({
        assets: [
          './demo/index.html'
        ],
        outputDir: 'dist'
      }),

      server && serve({
        contentBase: 'dist',
        historyApiFallback: '/index.html',
        port: 8081
      })
    ],

    watch: {
      include: '**',
      exclude: 'node_modules/**'
    },

    onwarn: function(warning) {
      if (warning.code !== 'CIRCULAR_DEPENDENCY') {
        console.error(`(!) ${warning.message}`);
      }
    }
  }
}
