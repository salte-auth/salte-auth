import 'whatwg-fetch';
import 'url-polyfill';
import 'es6-promise/auto';

import { Generic, SalteAuth } from '../src/salte-auth';
import { Redirect } from './redirect';

const auth = new SalteAuth({
  providers: [
    new Generic.OpenID({
      login(): string {
        return 'https://salte-os.auth0.com/authorize';
      },

      logout(): string {
        return this.url('https://salte-os.auth0.com/v2/logout', {
          client_id: this.config.clientID,
          returnTo: this.config.redirectUrl,
        });
      },

      clientID: '9JTBXBREtckkFHTxTNBceewrnn7NeDd0',
      responseType: 'id_token',

      routes: true,
    }),

    new Generic.OAuth2({
      login(): string {
        return 'https://github.com/login/oauth/authorize';
      },

      clientID: 'b44780ca7678681180c9',
      responseType: 'code',
    }),
  ],

  handlers: [
    new Redirect({
      default: true,
      navigate: 'history',
    })
  ],
});

auth.on('login', (error, data) => {
  if (error) console.error(error);
  else console.log(data);
});

const loginButton = document.createElement('button');
loginButton.id = 'login';
loginButton.innerHTML = `Login`;
loginButton.addEventListener('click', () => {
  auth.login('generic.openid');
});
document.body.appendChild(loginButton);

const logoutButton = document.createElement('button');
logoutButton.id = 'logout';
logoutButton.innerHTML = `Logout`;
logoutButton.addEventListener('click', () => {
  auth.logout('generic.openid');
});
document.body.appendChild(logoutButton);
