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

if (auth.profile.idTokenExpired) {
  auth.loginWithRedirect();
}
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

      // This parameter is specifically handled by `@salte-auth/auth0`
      audience: 'my-audience',
      responseType: 'id_token token',
      redirectUrl: 'https://salte.io/authorize',
      clientID: 'my-client-id',
      scope: 'openid',

      routes: ['/account'],

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

auth.on('login', (error, idToken) => {
  if (error) console.error(error);
  else console.log(idToken.user);
});

if (auth.provider('auth0').idToken().expired) {
  auth.login({
    provider: 'auth0',
    handler: 'redirect'
  });

  // The above example can also be shortened to the following:
  auth.login('auth0'); // This will use the default handler.
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}
