// Polyfills
import 'unfetch/polyfill';
import Promise from 'promise-polyfill';

window.Promise = Promise;

const testsContext = require.context('.', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
