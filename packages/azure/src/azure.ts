import { OpenIDProvider } from '@salte-auth/salte-auth';

export class Azure extends OpenIDProvider {
  public constructor(config: Azure.Config) {
    super(config);
  }

  public get name(): string {
    return 'azure';
  }

  public get login(): string {
    return this.url(`${this.config.url}/oauth2/v2.0/authorize`);
  }

  public get logout(): string {
    return this.url(`${this.config.url}/oauth2/logout`, {
      post_logout_redirect_uri: this.redirectUrl('logout')
    });
  }
}

export interface Azure {
  config: Azure.Config;
}

export declare namespace Azure {
  interface Config extends OpenIDProvider.Config {
    /**
     * The domain of your Azure AD Instance.
     *
     * @example 'https://login.microsoftonline.com/tenant-id'
     */
    url: string;
  }
}
