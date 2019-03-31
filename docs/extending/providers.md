# Providers

## Creating a Provider

It's incredibly simple to create a custom provider!

{% hint style='info' %}
We highly recommend you write your Provider in TypeScript to take advantage of our documentation!
{% endhint %}

{% code-tabs %}
{% code-tabs-item title="TypeScript" %}
```typescript
import { OpenIDProvider } from '@salte-auth/salte-auth';

export class Auth0 extends OpenIDProvider {
  public config: Auth0.Config;

  constructor(config: Auth0.Config) {
    super(config);
  }

  // This needs to be a name unique to your provider.
  get name(): string {
    return 'auth0';
  }

  // This needs to build a url containing any provider unique values.
  get login(): string {
    // In this case Auth0's "/authorize" is right at the root and 
    // it supports a custom audience parameter.
    return this.url(`${this.config.url}/authorize`, {
      audience: this.config.audience
    });
  }

  // This needs to build the logout url of your given provider
  get logout(): string {
    return this.url(`${this.config.url}/v2/logout`, {
      returnTo: this.config.redirectUrl,
      client_id: this.config.clientID
    });
  }
}

export declare namespace Auth0 {
  interface Config extends OpenIDProvider.Config {
    audience?: string
  }
}
```
{% endcode-tabs-item %}

{% code-tabs-item title="JavaScript" %}
```javascript
import { OpenIDProvider } from '@salte-auth/salte-auth';

export class Auth0 extends OpenIDProvider {
  // This needs to be a name unique to your provider.
  get name() {
    return 'auth0';
  }

  // This needs to build a url containing any provider unique values.
  get login() {
    // In this case Auth0's "/authorize" is right at the root and 
    // it supports a custom audience parameter.
    return this.url(`${this.config.url}/authorize`, {
      audience: this.config.audience
    });
  }

  // This needs to build the logout url of your given provider
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

## Usage

```javascript
import { SalteAuth } from '@salte-auth/salte-auth';
import { Auth0 } from 'my-auth0-provider';

const auth = new SalteAuth({
  // ...

  providers: [
    new Auth0({
      url: 'https://salte-os.auth0.com',
      clientID: '9JTBXBREtckkFHTxTNBceewrnn7NeDd0'
    })
  ]
});

auth0.login('auth0');
```
