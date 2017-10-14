// Polyfills
import fetch from 'unfetch';
import Promise from 'promise-polyfill';

window.fetch = fetch;
window.Promise = Promise;

const testsContext = require.context('.', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
