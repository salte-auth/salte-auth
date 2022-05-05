import { OAuth2Provider, Utils } from '@salte-auth/salte-auth';

export class Discord extends OAuth2Provider {
  public constructor(config: Discord.Config) {
    super(config);

    this.config = Utils.Common.defaults(this.config, {
      scope: 'identify'
    });
  }

  public get name() {
    return 'discord';
  }

  public get login() {
    return 'https://discordapp.com/api/oauth2/authorize';
  }
}

export interface Discord {
  config: Discord.Config;
}

export declare namespace Discord {
  interface Config extends OAuth2Provider.Config {
    /**
     * A list of space-delimited claims used to determine what user information is provided and what access is given.
     *
     * @default 'identify'
     */
    scope?: string;
  }
}
