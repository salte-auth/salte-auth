import { OAuth2Provider } from '@salte-auth/salte-auth';

export class Facebook extends OAuth2Provider {
  public constructor(config: Facebook.Config) {
    super(config);
  }

  public get name(): string {
    return 'facebook';
  }

  public get login(): string {
    return 'https://www.facebook.com/v6.0/dialog/oauth';
  }
}

export interface Facebook {
  config: Facebook.Config;
}

export declare namespace Facebook {
  interface Config extends OAuth2Provider.Config {
    /**
     * The Facebook App ID
     *
     * @see https://developers.facebook.com/apps
     */
    clientID: string;
  }
}
