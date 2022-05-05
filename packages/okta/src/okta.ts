import { OpenIDProvider } from '@salte-auth/salte-auth';

export class Okta extends OpenIDProvider {
  public constructor(config: Okta.Config) {
    super(config);
  }

  public get name(): string {
    return 'okta';
  }

  public get login(): string {
    return this.url(`${this.config.url}/oauth2/v1/authorize`);
  }

  public get logout(): string {
    return this.url(`${this.config.url}/oauth2/v1/logout`, {
      id_token_hint: this.idToken.raw,
      post_logout_redirect_uri: this.redirectUrl('logout')
    });
  }
}

export interface Okta {
  config: Okta.Config;
}

export declare namespace Okta {
  export interface Config extends OpenIDProvider.Config {
    /**
     * The domain of your Okta tenant.
     *
     * @example 'https://dev-960892.oktapreview.com'
     */
    url: string;
  }
}
