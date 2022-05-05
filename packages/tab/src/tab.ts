import { Handler, SalteAuthError, Utils, OAuth2Provider, OpenIDProvider } from '@salte-auth/salte-auth';

export class Tab extends Handler {
  public constructor(config?: Tab.Config) {
    super(config);

    this.config = Utils.Common.defaults(this.config, {
      window: {
        name: '@salte-auth/tab'
      }
    });
  }

  public get name(): string {
    return 'tab';
  }

  public get auto(): boolean {
    return false;
  }

  public async open({ url, redirectUrl }: Handler.OpenOptions): Promise<OAuth2Provider.Validation | OpenIDProvider.Validation> {
    const tabWindow = window.open(url, '_blank');
    if (!tabWindow) {
      throw new SalteAuthError({
        message: 'We were unable to open the new tab, its likely that the request was blocked.',
        code: 'tab_blocked'
      });
    }

    tabWindow.name = 'salte-auth';
    tabWindow.focus();
    // TODO: Find a better way of tracking when a Window closes.
    return new Promise((resolve, reject) => {
      const checker = setInterval(() => {
        try {
          if (tabWindow.closed) {
            throw new SalteAuthError({
              message: 'The user closed the tab before authentication could be completed.',
              code: 'tab_closed'
            });
          }

          const { location } = tabWindow;
          // This could throw cross-domain errors, so we need to silence them.
          if (location.href.indexOf(redirectUrl) !== 0) return;

          const parsed = Utils.URL.parse(location);

          tabWindow.close();
          resolve(parsed);
        } catch (error) {
          if (Utils.Events.isCrossDomainError(error)) return;

          if (!tabWindow.closed) tabWindow.close();
          clearInterval(checker);

          reject(error);
        }
      }, 100);
    });
  }
}

export interface Tab {
  config: Tab.Config;
}

export declare namespace Tab {
  export interface Config extends Handler.Config {
    /**
     * The tab window configuration.
     */
    window?: {
      /**
       * The name to attach to the tab window.
       *
       * @default '@salte-auth/tab'
       */
      name?: string;
    };
  }
}
