import { Events } from './events';

import { Common } from '../../utils';

export abstract class Shared extends Events {
  constructor(config?: Shared.Config) {
    super(config);

    this.config = Common.defaults(this.config, {
      redirectUrl: location.origin,
      level: 'warn'
    });
  }

  /**
   * Returns a redirect url for the given login type.
   * @param type Are we logging in or logging out?
   */
  redirectUrl(type: 'login'|'logout'): string {
    if (typeof(this.config.redirectUrl) === 'string') {
      return this.config.redirectUrl;
    }

    return this.config.redirectUrl[type];
  }
}

export interface Shared {
  config: Shared.Config;
}

export declare namespace Shared {
  export interface Config extends Events.Config {
    [key: string]: any;

    /**
     * URL the Provider will send the response back to.
     */
    redirectUrl?: string | RedirectUrl;
  }

  export interface RedirectUrl {
    /**
     * The URL the Provider will send the response back to on login.
     */
    login: string;

    /**
     * The URL the Provider will send the response back to on logout.
     */
    logout: string;
  }
}
