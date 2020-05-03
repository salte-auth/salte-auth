# Getting Started

🎉 Huzzah! So you've decided to take the plunge into the wonderful world of Authentication!

This guide will attempt to quickly walk you through how you can utilize Salte Auth for authentication.

## Picking a Provider

### What is a Provider?

A `Provider` (Identity Provider) tells Salte Auth _who_ you're going to be authenticating with.

For a list of examples you should check out the [providers](providers.md) page!.

### 😱 Which Provider should I use?!?

That primarily depends on where your priorities are.

#### I need all the features!

If you're worried about SSO (Single Sign-On) then an OpenID Connect Provider like [Auth0](https://github.com/salte-auth/auth0), [Azure](https://github.com/salte-auth/azure), etc. are probably your best bet.

#### I'm not made of money!

If cost is more of a concern I'd recommend using one of the OAuth2 Providers like [GitHub](https://github.com/salte-auth/github), [Google](https://github.com/salte-auth/google), [Facebook](https://github.com/salte-auth/facebook), etc.

## Picking a Handler

### What is a Handler?

A `Handler` tells Salte Auth _how_ you're going to be authenticating.

For a list of examples you should check out the [handlers](handlers.md) page!.

## Setting up Salte Auth

### Install

```sh
# Install the Core
$ npm install @salte-auth/salte-auth
# Install a Provider
$ npm install @salte-auth/auth0
# Install a Handler
$ npm install @salte-auth/redirect
```

### Usage

```js
import { SalteAuth } from '@salte-auth/salte-auth';
import { Auth0 } from '@salte-auth/auth0';
import { Tab } from '@salte-auth/tab';

// Configure SalteAuth with Auth0's url and client id.
const auth = new SalteAuth({
  providers: [
    new Auth0({
      url: 'https://salte-os.auth0.com',
      clientID: '9JTBXBREtckkFHTxTNBceewrnn7NeDd0',

      routes: true
    })
  ],

  handlers: [
    new Tab({
      default: true
    })
  ]
});
```

### Examples

Checkout our [examples repository](https://github.com/salte-auth/examples) for a collection of examples in a variety of frameworks!
