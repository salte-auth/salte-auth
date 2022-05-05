import { OpenIDProvider } from '@salte-auth/salte-auth';

export class Auth0 extends OpenIDProvider {
  public constructor(config: Auth0.Config) {
    super(config);
  }

  public get name(): string {
    return 'auth0';
  }

  public get login(): string {
    return this.url(`${this.config.url}/authorize`, {
      audience: this.config.audience
    });
  }

  public get logout(): string {
    return this.url(`${this.config.url}/v2/logout`, {
      returnTo: this.redirectUrl('logout'),
      client_id: this.config.clientID
    });
  }
}

export interface Auth0 {
  config: Auth0.Config;
}

export declare namespace Auth0 {
  interface Config extends OpenIDProvider.Config {
    /**
     * The domain of your Auth0 tenant.
     *
     * @example 'https://salte.auth0.com'
     */
    url: string;

    /**
     * The unique identifier of the target API you want to access.
     */
    audience?: string;
  }
}
