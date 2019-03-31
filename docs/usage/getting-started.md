# Getting Started

👋 Hey there, thanks for taking the time to check us out!

#### Table Of Contents

- [Picking a Provider](#picking-a-provider)
- [Picking a Handler](#picking-a-handler)
- [Setting up Salte Auth](#setting-up-salte-auth)
  - [Install](#install)
  - [Usage](#usage)

## Picking a Provider

### What is a Provider?

A `Provider` (Identity Provider) tells Salte Auth _who_ you're going to be authenticating with.

For a list of examples you should check out the [providers](usage/providers.md) page!.

## Picking a Handler

### What is a Handler?

A `Handler` tells Salte Auth _how_ you're going to be authenticating.

For a list of examples you should check out the [handlers](usage/handlers.md) page!.

## Setting up Salte Auth

### Install

```sh
$ npm install @salte-auth/salte-auth
```

### Usage

```js
import { SalteAuth } from '@salte-auth/salte-auth';
import { Auth0 } from '@salte-auth/auth0';
import { Redirect } from '@salte-auth/redirect';

// Configure SalteAuth with Auth0's url and client id.
const auth = new SalteAuth({
  providers: [
    new Auth0({
      url: 'https://salte-os.auth0.com',
      clientID: '9JTBXBREtckkFHTxTNBceewrnn7NeDd0'
    })
  ],

  handlers: [
    new Redirect({
      default: true
    })
  ]
});

// Redirects the user to your Auth0 login page!
auth.login('auth0');
```
