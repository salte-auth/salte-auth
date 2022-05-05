import { Handler, SalteAuthError, Utils, OAuth2Provider, OpenIDProvider } from '@salte-auth/salte-auth';

export class Popup extends Handler {
  public constructor(config?: Popup.Config) {
    super(config);

    this.config = Utils.Common.defaults(this.config, {
      window: {
        name: '@salte-auth/popup',
        height: 600,
        width: 600
      }
    });
  }

  public get name(): string {
    return 'popup';
  }

  public get auto(): boolean {
    return false;
  }

  public async open(options: Handler.OpenOptions): Promise<OAuth2Provider.Validation | OpenIDProvider.Validation> {
    const top = ((window.innerHeight / 2) - (this.config.window.height / 2)) + window.screenTop;
    const left = ((window.innerWidth / 2) - (this.config.window.width / 2)) + window.screenLeft;
    const popupWindow = window.open(options.url, this.config.window.name, `height=${this.config.window.height}, width=${this.config.window.width}, status=yes, toolbar=no, menubar=no, location=no, top=${top}, left=${left}`);
    if (!popupWindow) {
      throw new SalteAuthError({
        message: 'We were unable to open the popup window, its likely that the request was blocked.',
        code: 'popup_blocked'
      });
    }

    popupWindow.focus();
    // TODO: Find a better way of tracking when a Window closes.
    return new Promise((resolve, reject) => {
      const checker = setInterval(() => {
        try {
          if (!popupWindow.closed) {
            // This could throw cross-domain errors, so we need to silence them.
            if (popupWindow.location.href.indexOf(options.redirectUrl) !== 0) return;

            const parsed = Utils.URL.parse(popupWindow.location);

            popupWindow.close();
            resolve(parsed);
          }

          clearInterval(checker);
        } catch (error) {
          if (Utils.Events.isCrossDomainError(error)) return;

          popupWindow.close();
          clearInterval(checker);

          reject(error);
        }
      }, 100);
    });
  }
}

export interface Popup {
  config: Popup.Config;
}

export declare namespace Popup {
  export interface Config extends Handler.Config {
    /**
     * The popup window configuration.
     */
    window?: {
      /**
       * The name to attach to the popup window.
       *
       * @default '@salte-auth/popup'
       */
      name?: string;

      /**
       * The height of the popup window.
       *
       * @default 600
       */
      height?: number;

      /**
       * The width of the popup window.
       *
       * @default 600
       */
      width?: number;
    };
  }
}
