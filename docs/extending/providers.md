# Providers

## Creating a Provider

It's incredibly simple to create a custom provider!

{% hint style='info' %}
We highly recommend you write your Provider in TypeScript to take advantage of our documentation!
{% endhint %}

{% code-tabs %}
{% code-tabs-item title="TypeScript" %}
```typescript
// my-custom-provider.ts
import { OpenIDProvider } from '@salte-auth/salte-auth';

export class Auth0 extends OpenIDProvider {
  constructor(config: Auth0.Config) {
    super(config);
  }

  /**
   * This is the default name of the provider.
   */
  get name() {
    return 'auth0';
  }

  /**
   * This should use `this.config.url` to build the provider-specific login url.
   */
  get login() {
    // In this case Auth0's "/authorize" is right at the root and 
    // it supports a custom audience parameter.
    return this.url(`${this.config.url}/authorize`, {
      audience: this.config.audience
    });
  }

  /**
   * This should use `this.config.url` to build the provider-specific logout url.
   */
  get logout() {
    return this.url(`${this.config.url}/v2/logout`, {
      returnTo: this.config.redirectUrl,
      client_id: this.config.clientID
    });
  }
}

export interface Auth0 {
  config: Auth0.Config;
}

export declare namespace Auth0 {
  export interface Config extends OpenIDProvider.Config {
    audience?: string
  }
}
```
{% endcode-tabs-item %}

{% code-tabs-item title="JavaScript" %}
```javascript
// my-custom-provider.js
import { OpenIDProvider } from '@salte-auth/salte-auth';

export class CustomProvider extends OpenIDProvider {
  /**
   * This is the default name of the provider.
   */
  get name() {
    return 'auth0';
  }

  /**
   * This should use `this.config.url` to build the provider-specific login url.
   */
  get login() {
    // In this case Auth0's "/authorize" is right at the root and 
    // it supports a custom audience parameter.
    return this.url(`${this.config.url}/authorize`, {
      audience: this.config.audience
    });
  }

  /**
   * This should use `this.config.url` to build the provider-specific logout url.
   */
  get logout() {
    return this.url(`${this.config.url}/v2/logout`, {
      returnTo: this.config.redirectUrl,
      client_id: this.config.clientID
    });
  }
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

## Using your Custom Provider

It's equally as easy to use a custom provider.

```js
import { SalteAuth } from '@salte-auth/salte-auth';
import { Tab } from '@salte-auth/tab';
import { CustomProvider } from './my-custom-provider.js';

const auth = new SalteAuth({
  // ...

  providers: [
    new CustomProvider({
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

auth0.login('auth0');
```

