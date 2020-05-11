# Migration Guide

This is a basic guide to the different configuration options and how they map between the two versions.

{% code-tabs %}
{% code-tabs-item title="@salte-auth/salte-auth@^2.0.0" %}
```js
import { SalteAuth } from '@salte-auth/salte-auth';

const auth = new SalteAuth({
  providerUrl: 'https://salte-os.auth0.com',
  responseType: 'id_token token',
  redirectUrl: 'https://salte.io/authorize',
  clientId: 'my-client-id',
  scope: 'openid',
  routes: ['/account'],
  endpoints: [
    'https://api.google.com'
  ],
  provider: 'auth0',
  loginType: 'redirect',
  redirectLoginCallback: function(error) {
    if (error) console.error(error);
  },

  storageType: 'session',

  validation: {
    nonce: false
  },

  autoRefresh: true,
  autoRefreshBuffer: 1000,
  queryParams: {
    audience: 'my-audience'
  }
});

console.log(auth.profile.userInfo);
```
{% endcode-tabs-item %}

{% code-tabs-item title="@salte-auth/salte-auth@^3.0.0" %}
```js
import { SalteAuth } from '@salte-auth/salte-auth';
import { Redirect } from '@salte-auth/redirect';
import { Auth0 } from '@salte-auth/auth0';

const auth = new SalteAuth({
  providers: [
    new Auth0({
      url: 'https://salte-os.auth0.com',

      audience: 'my-audience', // This is a `@salte-auth/auth0` specific parameter.
      responseType: 'id_token token',
      redirectUrl: 'https://salte.io/authorize',
      clientID: 'my-client-id',
      scope: 'openid',

      routes: true,

      endpoints: [
        'https://api.google.com'
      ],

      storage: 'session',

      validation: {
        nonce: false
      },

      renewal: {
        type: 'auto',
        buffer: 1000
      }
    })
  ],

  handlers: [
    new Redirect({
      default: true
    })
  ]
});

auth.on('login', (error, { data: idToken }) => {
  if (error) console.error(error);
  else console.log(idToken.user);
});

console.log(auth.provider('auth0').idToken.user);
```
{% endcode-tabs-item %}
{% endcode-tabs %}
