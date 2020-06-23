<h2 align="center">
  <div>
    <a href="https://github.com/salte-auth/logos">
      <img height="190px" src="https://raw.githubusercontent.com/salte-auth/logos/master/images/logo.svg?sanitize=true">
      <br>
      <br>
      <img height="50px" src="https://raw.githubusercontent.com/salte-auth/logos/master/images/%40salte-auth/salte-auth.svg?sanitize=true">
    </a>
  </div>
</h2>

<h3 align="center">
	OAuth 2.0 for the masses!
</h3>

<p align="center">
	<strong>
		<!-- <a href="https://salte.io">Website</a> -->
		<!-- • -->
		<a href="https://salte-auth.github.io/salte-auth">Docs</a>
		•
		<a href="https://salte-auth-2-demo.glitch.me">Demo</a>
	</strong>
</p>

<div align="center">

  [![NPM Version][npm-version-image]][npm-url]
  [![NPM Downloads][npm-downloads-image]][npm-url]
  [![Travis][travis-ci-image]][travis-ci-url]
  [![Coveralls][coveralls-image]][coveralls-url]

  [![semantic-release][semantic-release-image]][semantic-release-url]
  [![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]
  
</div>

## Supported Browsers

_If a version isn't specified that means we test on the latest and greatest, however most versions of that browser should work._

- Chrome
- Firefox
- Safari 8+ (7.1 and below require a [Promise polyfill](#promise-polyfill))
- Edge
- IE 10+ (Requires a [Promise polyfill](#promise-polyfill))

## Promise Polyfill

Here's a list of well known ES6 Promise implementations developed by the community!

* [es6-promise](https://www.npmjs.com/package/es6-promise)
* [native-promise-only](https://www.npmjs.com/package/native-promise-only)
* [bluebird](https://www.npmjs.com/package/bluebird)

**Any other ES6 Promise implementation will work as well!**

## Install

You can install this package either with `npm` or with `bower`.

## npm

```sh
$ npm install @salte-auth/salte-auth
```

Then add a `<script>` to your index.html:

```html
<script src="/node_modules/@salte-auth/dist/salte-auth.js"></script>
```

Or `require('@salte-auth/salte-auth')` from your code.

## bower

```sh
$ bower install salte-auth/salte-auth
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

## ES6 Usage

```js
import { SalteAuth } from '@salte-auth/salte-auth';

// Configure SalteAuth with Auth0's url and client id.
const auth = new SalteAuth({
  providerUrl: 'https://salte-os.auth0.com',
  responseType: 'id_token',
  redirectUrl: location.origin,
  clientId: '9JTBXBREtckkFHTxTNBceewrnn7NeDd0',
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

## ES5 Usage

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="/node_modules/@salte-auth/salte-auth/dist/salte-auth.js"></script>
    <script>
      const auth = new salte.SalteAuth({
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

        provider: 'auth0',
      });

      auth.loginWithIframe();
    </script>
  </head>
  <body>
    ...
  </body>
</html>
```

## Known Issues

_These are issues that we know about, but don't have a clear fix for!_

**There are currently no known issues, thanks for checking!**

## Debugging

Debug logging can be enabled by setting a `localStorage` variable of `debug` to `@salte-auth/salte-auth*`.

## Documentation

[Click here to view the documentation!](https://salte-auth.github.io/salte-auth/)

**Use private or undocumented methods at your own risk, as they will not require a major version bump when breaking changes are made!**

## Shoutouts

- [Auth0](https://auth0.com/?utm_source=oss&utm_medium=gp&utm_campaign=oss) - For providing us with an open source tenant!

<a href="https://auth0.com/?utm_source=oss&utm_medium=gp&utm_campaign=oss" target="_blank" alt="Single Sign On & Token Based Authentication - Auth0">
  <img height="50" alt="JWT Auth for open source projects" src="https://cdn.auth0.com/oss/badges/a0-badge-dark.png"/>
</a>

[npm-version-image]: https://img.shields.io/npm/v/@salte-auth/salte-auth.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/@salte-auth/salte-auth.svg?style=flat
[npm-url]: https://npmjs.org/package/@salte-auth/salte-auth

[travis-ci-image]: https://img.shields.io/travis/com/salte-auth/salte-auth/master.svg?style=flat
[travis-ci-url]: https://travis-ci.com/salte-auth/salte-auth

[coveralls-image]: https://img.shields.io/coveralls/salte-auth/salte-auth/master.svg
[coveralls-url]: https://coveralls.io/github/salte-auth/salte-auth?branch=master

[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: https://commitizen.github.io/cz-cli/

[semantic-release-url]: https://github.com/semantic-release/semantic-release
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

[greenkeeper-image]: https://badges.greenkeeper.io/salte-auth/salte-auth.svg
[greenkeeper-url]: https://greenkeeper.io
