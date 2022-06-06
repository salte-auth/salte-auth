import { OpenIDProvider, Utils } from '@salte-auth/salte-auth';

export class Google extends OpenIDProvider {
  constructor(config?: Google.Config) {
    super(config);

    Utils.Common.defaults(config, {
      scope: 'https://www.googleapis.com/auth/userinfo.profile'
    })
  }

  public get name(): string {
    return 'google';
  }

  public get login(): string {
    return 'https://accounts.google.com/o/oauth2/v2/auth';
  }
}

export interface Google {
  config: Google.Config;
}

export declare namespace Google {
  interface Config extends OpenIDProvider.Config {
    /**
     * A list of space-delimited claims used to determine what user information is provided and what access is given.
     *
     * @default 'https://www.googleapis.com/auth/userinfo.profile'
     */
    scope?: string;
  }
}
