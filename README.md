# Salte Auth

[![Gitter][gitter-image]][gitter-url]
[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Travis][travis-ci-image]][travis-ci-url]
[![Coveralls][coveralls-image]][coveralls-url]

[![Commitizen friendly][commitizen-image]][commitizen-url]
[![semantic-release][semantic-release-image]][semantic-release-url]
[![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

OAuth 2.0 for the masses!

## Install

You can install this package either with `npm`.

## npm

```sh
$ npm install @salte-io/salte-auth
```

Then add a `<script>` to your index.html:

```html
<script src="/node_modules/@salte-io/salte-auth.js"></script>
```

Or `require('@salte-io/salte-auth')` from your code.

## Usage

```js
import { SalteAuth } from '@salte-io/salte-auth';

// Configure SalteAuth with Auth0's gateway url and clientId.
const auth = new SalteAuth({
  gateway: 'https://salte-io.auth0.com',
  responseType: 'id_token',
  redirectUrl: location.origin,
  clientId: 'Hzl9Rvu_Ws_s1QKIhI2TXi8NZRn672FC',
  scope: 'openid',

  routes: [
      'http://localhost:8080/account'
  ],

  endpoints: [
      'https://jsonplaceholder.typicode.com/posts/1'
  ],

  provider: 'auth0'
});

// Display an iframe to the user that allows them to login
auth.signInWithIframe();
```

## Documentation

[Click here to view the documentation!](https://salte-io.github.io/salte-auth/)

[gitter-image]: https://badges.gitter.im/salte-io/salte-auth.svg
[gitter-url]: https://gitter.im/salte-io/salte-auth?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge

[npm-version-image]: https://img.shields.io/npm/v/@salte-io/salte-auth.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/@salte-io/salte-auth.svg?style=flat
[npm-url]: https://npmjs.org/package/@salte-io/salte-auth

[travis-ci-image]: https://img.shields.io/travis/salte-io/salte-auth/master.svg?style=flat
[travis-ci-url]: https://travis-ci.org/salte-io/salte-auth

[coveralls-image]: https://img.shields.io/coveralls/salte-io/salte-auth/master.svg
[coveralls-url]: https://coveralls.io/github/salte-io/salte-auth?branch=master

[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: https://commitizen.github.io/cz-cli/

[semantic-release-url]: https://github.com/semantic-release/semantic-release
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

[greenkeeper-image]: https://badges.greenkeeper.io/salte-io/salte-auth.svg
[greenkeeper-url]: https://greenkeeper.io
