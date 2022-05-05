<h2 align="center">
  <div>
    <a href="https://github.com/salte-auth/okta">
      <img height="180px" src="https://raw.githubusercontent.com/salte-auth/logos/main/images/logo.svg?sanitize=true">
      <br>
      <br>
      <img height="50px" src="https://raw.githubusercontent.com/salte-auth/logos/main/images/%40salte-auth/okta.svg?sanitize=true">
    </a>
  </div>
</h2>

<h3 align="center">
	A Salte Auth provider for authenticating with Okta!
</h3>

<p align="center">
	<strong>
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
$ npm install @salte-auth/okta
```

## Usage

```js
import { SalteAuth } from '@salte-auth/salte-auth';
import { Okta } from '@salte-auth/okta';
import { Redirect } from '@salte-auth/redirect';

/* 
 * Feel free to try out Salte Auth with this configuration!
 * 
 * It should work with the following domains:
 * - glitch.com
 * - localhost:8081
 */
const auth = new SalteAuth({
  providers: [
    new Okta({
      url: 'https://dev-960892.oktapreview.com',
      clientID: '0oajg1bj8hxM1z7pa0h7'
    })
  ],

  handlers: [
    new Redirect({
      default: true
    })
  ]
});

auth.login('okta');
```

[npm-version-image]: https://img.shields.io/npm/v/@salte-auth/okta.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/@salte-auth/okta.svg?style=flat
[npm-url]: https://npmjs.org/package/@salte-auth/okta

[github-actions-image]: https://github.com/salte-auth/okta/actions/workflows/ci.yml/badge.svg?branch=main 
[github-actions-url]: https://github.com/salte-auth/okta/actions/workflows/ci.yml

[coveralls-image]: https://img.shields.io/coveralls/salte-auth/okta/main.svg
[coveralls-url]: https://coveralls.io/github/salte-auth/okta?branch=main

[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: https://commitizen.github.io/cz-cli/

[semantic-release-url]: https://github.com/semantic-release/semantic-release
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
