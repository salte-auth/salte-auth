import { OAuth2Provider, Utils } from '@salte-auth/salte-auth';

export class GitLab extends OAuth2Provider {
  public constructor(config: GitLab.Config) {
    super(config);

    this.config = Utils.Common.defaults(this.config, {
      url: 'https://gitlab.com'
    });
  }

  public get name(): string {
    return 'gitlab';
  }

  public get login(): string {
    return `${this.config.url}/oauth/authorize`;
  }
}

export interface GitLab {
  config: GitLab.Config;
}

export declare namespace GitLab {
  interface Config extends OAuth2Provider.Config {
    /**
     * The domain of your GitLab Instance.
     *
     * @default 'https://gitlab.com'
     */
    url?: string;
  }
}

