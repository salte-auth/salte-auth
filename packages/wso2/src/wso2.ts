import { OpenIDProvider } from '@salte-auth/salte-auth';

export class WSO2 extends OpenIDProvider {
  public constructor(config: WSO2.Config) {
    super(config);
  }

  public get name(): string {
    return 'wso2';
  }

  public get login(): string {
    return this.url(`${this.config.url}/oauth2/authorize`);
  }

  public get logout(): string {
    // https://localhost:9443/oidc/logout?id_token_hint=<id_token>&post_logout_redirect_uri=<redirect URI>&state=<state>
    return this.url(`${this.config.url}/oidc/logout`, {
      id_token_hint: this.idToken.raw,
      post_logout_redirect_uri: this.redirectUrl('logout')
    });
  }
}

export interface WSO2 {
  config: WSO2.Config;
}

export declare namespace WSO2 {
  interface Config extends OpenIDProvider.Config {
    /**
     * The domain of your WSO2 tenant.
     *
     * @example 'https://wso2.salte.io'
     */
    url: string;
  }
}
