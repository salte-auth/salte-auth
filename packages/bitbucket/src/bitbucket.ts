import { OAuth2Provider, Utils } from '@salte-auth/salte-auth';

export class Bitbucket extends OAuth2Provider {
  public constructor(config: Bitbucket.Config) {
    super(config);

    this.config = Utils.Common.defaults(this.config, {
      url: 'https://bitbucket.org'
    });
  }

  public get name() {
    return 'bitbucket';
  }

  public get login() {
    return `${this.config.url}/site/oauth2/authorize`;
  }
}

export interface Bitbucket {
  config: Bitbucket.Config;
}

export declare namespace Bitbucket {
  interface Config extends OAuth2Provider.Config {
    /**
     * The domain of your Bitbucket Server Instance.
     *
     * @default 'https://bitbucket.org'
     */
    url?: string;
  }
}

