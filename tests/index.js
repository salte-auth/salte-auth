// Polyfills
import 'unfetch/polyfill/index.js';
import Promise from 'promise-polyfill';

window.Promise = Promise;

const testsContext = require.context('.', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
