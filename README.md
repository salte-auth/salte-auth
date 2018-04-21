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

You can install this package either with `npm` or with `bower`.

## npm

```sh
$ npm install @salte-io/salte-auth
```

Then add a `<script>` to your index.html:

```html
<script src="/node_modules/@salte-io/dist/salte-auth.js"></script>
```

Or `require('@salte-io/salte-auth')` from your code.

## bower

```sh
$ bower install salte-io/salte-auth
```

Then add a `<script>` to your index.html:

```html
<script src="/bower_components/salte-auth/dist/salte-auth.js"></script>
```

### HTML Imports (Polymer 1.x - 2.x)

We also support HTML Imports:

```html
<link rel="import" href="/bower_components/salte-auth/salte-auth.html">
```

## Usage

```js
import { SalteAuth } from '@salte-io/salte-auth';

// Configure SalteAuth with Auth0's url and client id.
const auth = new SalteAuth({
  providerUrl: 'https://salte-alpha.auth0.com',
  responseType: 'id_token',
  redirectUrl: location.origin,
  clientId: 'mM6h2LHJikwdbkvdoiyE8kHhL7gcV8Wb',
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
auth.loginWithIframe();
```

## Known Issues

* `loginWithNewTab` and `loginWithPopup` doesn't work on IE 11 ([#166](https://github.com/salte-io/salte-auth/issues/166), [#168](https://github.com/salte-io/salte-auth/issues/168))

## Debugging

Debug logging can be enabled by setting a `localStorage` variable of `debug` to `@salte-io/salte-auth*`.

## Documentation

[Click here to view the documentation!](https://salte-io.github.io/salte-auth/)

**Use private or undocumented methods at your own risk, as they will not require a major version bump when breaking changes are made!**

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
