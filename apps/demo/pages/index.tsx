import React, { useEffect, useState } from 'react';
import { Generic, SalteAuth } from '@salte-auth/salte-auth';
import { Redirect } from '@salte-auth/redirect';

export function App() {
  const [auth, setAuth] = useState<SalteAuth>();

  useEffect(() => {
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
    
          routes: false,
        }),
      ],
    
      handlers: [
        new Redirect({
          default: true,
        })
      ],
    });

    auth.on('login', (error, data) => {
      if (error) console.error(error);
      else console.log(data);
    });

    setAuth(auth);
  }, []);

  return (
    <div>
      <button 
        disabled={!auth}
        onClick={() => {
          if (!auth) return;

          auth.login('generic.openid');
        }}
      >
        Login
      </button>
      <button 
        disabled={!auth}
        onClick={() => {
          if (!auth) return;
          
          auth.logout('generic.openid');
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default App;