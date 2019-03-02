import '@webcomponents/custom-elements/src/native-shim.js';
import '@webcomponents/custom-elements';
import 'url-polyfill';
import 'whatwg-fetch';
import Promise from 'promise-polyfill';

window.Promise = Promise;

const testsContext = require.context('.', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
