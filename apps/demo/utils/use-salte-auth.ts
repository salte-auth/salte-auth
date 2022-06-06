import { useEffect, useState } from 'react';

import { SalteAuth } from '@salte-auth/salte-auth';

// Providers
import {Auth0} from '@salte-auth/auth0';
import {Azure} from '@salte-auth/azure';
import {Bitbucket} from '@salte-auth/bitbucket';
import {Discord} from '@salte-auth/discord';
import {Facebook} from '@salte-auth/facebook';
import {GitHub} from '@salte-auth/github';
import {GitLab} from '@salte-auth/gitlab';
import {Google} from '@salte-auth/google';
import {Okta} from '@salte-auth/okta';

// Handlers
import { Redirect } from '@salte-auth/redirect';

let _auth: SalteAuth;
export function useSalteAuth() {
  const [auth, setAuth] = useState<SalteAuth>();

  useEffect(() => {
    if (!_auth) {
      _auth = new SalteAuth({
        providers: [
          new Auth0({
            url: 'https://salte-os.auth0.com',
            clientID: '9JTBXBREtckkFHTxTNBceewrnn7NeDd0',
          }),

          new Azure({
            url: 'https://login.microsoftonline.com/3f6df7ce-5830-4280-ae97-8e4016d1c6d0',
            clientID: 'c679f65f-8070-4719-8798-31c6fc256736',
          }),

          new Bitbucket({
            clientID: 'rdAU2YGcBS2XMvDGQg',
            responseType: 'code',
          }),

          new Discord({
            clientID: '705261926048989185',
            responseType: 'code'
          }),

          new Facebook({
            clientID: '1133025073714056',
            responseType: 'code'
          }),

          new GitHub({
            clientID: 'b44780ca7678681180c9',
            responseType: 'code',
          }),

          new GitLab({
            clientID: '5031b3d3051210cfb8448cbe2af591a6bcc041e0170ab78a5d43d3e2d9f559ed',
            responseType: 'code',
          }),

          new Google({
            clientID: '701257675570-eno2h1b57kranmaoj4245hbk5pignduh.apps.googleusercontent.com',
            responseType: 'token',
          }),

          new Okta({
            url: 'https://dev-960892.oktapreview.com',
            clientID: '0oajg1bj8hxM1z7pa0h7'
          }),
        ],

        handlers: [
          new Redirect({
            default: true
          })
        ]
      });

      _auth.on('login', (error) => {
        debugger;
        if (error) return;

        setAuth(_auth);
      });

      _auth.on('logout', (error) => {
        if (error) return;

        setAuth(_auth);
      });
    }

    setAuth(_auth);
  }, []);

  return auth;
}
