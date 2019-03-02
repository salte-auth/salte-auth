import '@babel/polyfill';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import '@webcomponents/webcomponentsjs';
import 'whatwg-fetch';
import Promise from 'promise-polyfill';
delete window.URL; require('url-polyfill');

window.Promise = Promise;

const testsContext = require.context('.', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
