<h2 align="center">
  <div>
    <a href="https://github.com/salte-auth/logos">
      <img height="180px" src="https://raw.githubusercontent.com/salte-auth/logos/master/images/logo.svg?sanitize=true">
      <br>
      <br>
      <img height="50px" src="https://raw.githubusercontent.com/salte-auth/logos/master/images/%40salte-auth/salte-auth.svg?sanitize=true">
    </a>
  </div>
</h2>

<h3 align="center">
  Authentication for the modern web!
</h3>

<p align="center">
	<strong>
		<a href="https://salte-auth.github.io">API</a>
		•
		<a href="https://salte-auth.gitbook.io">Docs</a>
		•
		<a href="https://salte-auth-demo.glitch.me">Demo</a>
	</strong>
</p>

<div align="center">

  [![NPM Version][npm-version-image]][npm-url]
  [![NPM Downloads][npm-downloads-image]][npm-url]
  [![CI Build][github-actions-image]][github-actions-url]
  [![Coveralls][coveralls-image]][coveralls-url]

  [![semantic-release][semantic-release-image]][semantic-release-url]
  
</div>

## Install

```sh
$ npm install @salte-auth/salte-auth
```

## Usage

```js
import { SalteAuth } from '@salte-auth/salte-auth';
import { Auth0 } from '@salte-auth/auth0';
import { Tab } from '@salte-auth/tab';

// Configure SalteAuth with Auth0's url and client id.
const auth = new SalteAuth({
  providers: [
    new Auth0({
      url: 'https://salte-os.auth0.com',
      clientID: '9JTBXBREtckkFHTxTNBceewrnn7NeDd0'
    })
  ],

  handlers: [
    new Tab({
      default: true
    })
  ]
});

// Display an iframe to the user that allows them to login
auth.login('auth0');
```

## Known Issues

_These are issues that we know about, but don't have a clear fix for!_

**There are currently no known issues, thanks for checking!**

[npm-version-image]: https://img.shields.io/npm/v/@salte-auth/salte-auth.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/@salte-auth/salte-auth.svg?style=flat
[npm-url]: https://npmjs.org/package/@salte-auth/salte-auth

[github-actions-image]: https://img.shields.io/CI Build/com/salte-auth/salte-auth.svg?style=flat
[github-actions-url]: https://github.com/salte-auth/salte-auth/actions/workflows/ci.yml

[coveralls-image]: https://img.shields.io/coveralls/salte-auth/salte-auth.svg
[coveralls-url]: https://coveralls.io/github/salte-auth/salte-auth?branch=master

[semantic-release-url]: https://github.com/semantic-release/semantic-release
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
