# Handlers

## Creating a Handler

It's incredibly simple to create a custom handler!

{% hint style='info' %}
We highly recommend you write your Handler in TypeScript to take advantage of our documentation!
{% endhint %}

{% code-tabs %}
{% code-tabs-item title="TypeScript" %}
```typescript
// my-custom-handler.ts
import { Handler } from '@salte-auth/salte-auth';

export class CustomHandler extends Handler {
  /**
   * This is the default name of the handler.
   */
  get name() {
    return 'iframe';
  }

  /**
   * This determines whether the handler supports being automatically triggered
   * Handlers that require user input such as '@salte-auth/tab' 
   * and '@salte-auth/popup' don't support this.
   */
  get auto() {
    return true;
  }

  /**
   * This is invoked when `salte-auth` starts up.
   */
  connected({ action, handler, provider }: Handler.ConnectedOptions) {
    // Generally this won't be needed, however in certain cases such 
    // as `@salte-auth/redirect` it's used to wrap up authentication.
  }

  /**
   * This is invoked when the developer invokes `login` or `logout`
   * The expected response is a promise with the parsed url parameters.
   * 
   * For fully implemented examples check out our official handlers.
   * https://salte-auth.gitbook.io/salte-auth/usage/handlers
   */
  open({ url, redirectUrl }: Handler.OpenOptions): Promise<any> {
    // For the given example: https://google.com?token=12345&state=54321
    // This would be the expected response.
    Promise.resolve({
      token: '12345',
      state: '54321'
    });
  }
}
```
{% endcode-tabs-item %}

{% code-tabs-item title="JavaScript" %}
```javascript
// my-custom-handler.js
import { Handler } from '@salte-auth/salte-auth';

export class CustomHandler extends Handler {
  /**
   * This is the default name of the handler.
   */
  get name() {
    return 'iframe';
  }

  /**
   * This determines whether the handler supports being automatically triggered
   * Handlers that require user input such as '@salte-auth/tab' 
   * and '@salte-auth/popup' don't support this.
   */
  get auto() {
    return true;
  }

  /**
   * This is invoked when `salte-auth` starts up.
   */
  connected({ action, handler, provider }): object | void {
    // Generally this won't be needed, however in certain cases such 
    // as `@salte-auth/redirect` it's used to wrap up authentication.
  }

  /**
   * This is invoked when the developer invokes `login` or `logout`
   * The expected response is a promise with the parsed url parameters.
   * 
   * For fully implemented examples check out our official handlers.
   * https://salte-auth.gitbook.io/salte-auth/usage/handlers
   */
  open({ url, redirectUrl }): Promise<object> {
    // For the given example: https://google.com?token=12345&state=54321
    // This would be the expected response.
    Promise.resolve({
      token: '12345',
      state: '54321'
    });
  }
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

## Using your Custom Handler

It's equally as easy to use a custom handler.

```js
import { SalteAuth } from '@salte-auth/salte-auth';
import { Auth0 } from '@salte-auth/auth0';
import { CustomHandler } from './my-custom-handler.js';

const auth = new SalteAuth({
  // ...

  providers: [
    new Auth0({
      url: 'https://salte-os.auth0.com',
      clientID: '9JTBXBREtckkFHTxTNBceewrnn7NeDd0'
    })
  ],

  handlers: [
    new CustomHandler()
  ]
});

auth0.login('auth0');
```
