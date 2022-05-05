import { Handler, SalteAuthError, Utils } from '@salte-auth/salte-auth';

export class Redirect extends Handler {
  public constructor(config?: Redirect.Config) {
    super(config);

    this.config = Utils.Common.defaults(this.config, {
      timeout: 10000
    });
  }

  public get name(): string {
    return 'redirect';
  }

  public get auto(): boolean {
    return true;
  }

  public connected({ action }: Handler.ConnectedOptions): any {
    if (!action) return;

    const origin = this.storage.get('origin');

    if (!origin) return;

    this.storage.delete('origin');

    if (action === 'login') {
      // Does it make sense to navigate on 'logout'?
      // NOTE: This order, matters since navigate modifies the location.
      const parsed = Utils.URL.parse(location);
      this.navigate(origin);
      return parsed;
    }
  }

  public open({ url, timeout = this.config.timeout }: Redirect.OpenOptions): Promise<void> {
    this.storage.set('origin', location.href);

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
