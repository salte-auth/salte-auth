import { Handler, SalteAuthError, Utils } from '../src/salte-auth';

export class Redirect extends Handler {
  get name() {
    return 'redirect';
  }

  get auto() {
    return true;
  }

  public connected({ action, handler, provider }: Handler.ConnectedOptions) {
    if (handler !== this.name) return;

    if (action === 'login') {
      const origin = this.get('origin');

      if (!origin) return;

      this.clear('origin');

      if (provider) {
        provider.validate(Utils.URL.parse(location));
        this.navigate(origin);
      } else {
        throw new SalteAuthError({
          code: 'unknown_provider',
          message: 'Unable to validate due to unknown provider!',
        });
      }
    } else if (action === 'logout') {
      if (provider) {
        provider.reset();
      } else {
        throw new SalteAuthError({
          code: 'unknown_provider',
          message: 'Unable to reset due to unknown provider!',
        });
      }
    }
  }

  public open({ url, timeout = 10000 }: Redirect.OpenOptions) {
    this.set('origin', location.href);

    this.navigate(url);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new SalteAuthError({
          code: 'redirect_timeout',
          message: `Timed out while redirecting.`,
        }));
      }, timeout);
    });
  }
}

export declare namespace Redirect {
  export interface OpenOptions extends Handler.OpenOptions {
    timeout?: number;
  }
}
