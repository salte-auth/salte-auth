import { Handler, SalteAuthError, Utils, OAuth2Provider, OpenIDProvider } from '../src/salte-auth';

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

  public connected({ action }: Handler.ConnectedOptions): OAuth2Provider.Validation | OpenIDProvider.Validation | void {
    if (!action) return;

    const origin = this.storage.get('origin');

    if (!origin) return;

    this.storage.delete('origin');

    const parsed = Utils.URL.parse(location);

    this.navigate(origin);

    if (action === 'login') {
      return parsed;
    }
  }

  public async open({ url, timeout = this.config.timeout }: Redirect.OpenOptions): Promise<OAuth2Provider.Validation | OpenIDProvider.Validation | void> {
    this.storage.set('origin', location.href.replace(location.hash, ''));

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
     * @defaultValue 10000
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
