import { Handler, SalteAuthError, Utils } from '../src/salte-auth';

export class Redirect extends Handler {
  public constructor(config?: Redirect.Config) {
    super(config);

    this.config = Utils.Common.defaults(this.config, {
      timeout: 10000
    });
  }

  public get name() {
    return 'redirect';
  }

  public get auto() {
    return true;
  }

  public connected({ action }: Handler.ConnectedOptions) {
    if (!action) return;

    const origin = this.get('origin');

    if (!origin) return;

    this.clear('origin');

    const parsed = Utils.URL.parse(location);

    this.navigate(origin);

    if (action === 'login') {
      return parsed;
    }
  }

  public open({ url, timeout = this.config.timeout }: Redirect.OpenOptions) {
    this.set('origin', location.href);

    this.navigate(url);

    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject(new SalteAuthError({
          code: 'redirect_timeout',
          message: `Timed out while redirecting.`,
        }));
      }, timeout);
    });
  }
}

export interface Redirect {
  config: Redirect.Config;
}

export declare namespace Redirect {
  export interface Config extends Handler.Config {
    /**
     * The amount of time in ms before any login / logout requests will timeout.
     *
     * @default 10000
     */
    timeout?: number;
  }

  export interface OpenOptions extends Handler.OpenOptions {
    /**
     * Override the configured timeout.
     */
    timeout?: number;
  }
}
