import { Storage } from './core/storage';
import { Common, Logger, URL } from '../utils';

export class Handler extends Storage {
  protected logger: Logger;

  public constructor(config?: Handler.Config) {
    super(config);

    this.config = Common.defaults(this.config, {
      navigate: 'reload',
      level: 'warn'
    });
    this.logger = new Logger(`@salte-auth/salte-auth:handlers/${this.$name}`, this.config.level);
  }

  /**
   * The unique name of the handler
   */
  public get $name() {
    return this.config.name || this.name;
  }

  protected get key() {
    return `salte.auth.handler.${this.$name}`;
  }

  /**
   * Navigates to the url provided.
   * @param url the url to navigate to
   */
  /* istanbul ignore next */
  protected navigate(url: string) {
    if (this.config.navigate === 'history' && url.indexOf(URL.origin) === 0) {
      history.pushState('', document.title, url);
    }

    location.href = url;
  }
}

export interface Handler {
  config: Handler.Config;

  /**
   * The unique name of the handler
   */
  name: string;

  /**
   * Determines whether the handler supports automatic login.
   */
  auto: boolean;

  open(options: Handler.OpenOptions): Promise<object>;
  connected?(options: Handler.ConnectedOptions): object | void;
}

export declare namespace Handler {
  export interface Config extends Storage.Config {
    /**
     * Overrides the default name of the handler.
     */
    name?: string;

    /**
     * Dictates that this is the default handler.
     */
    default?: boolean;

    /**
     * Determines how page navigations are interpreted by this handler.
     *
     * * **reload:** Reloads the whole page when `navigate` is invoked.
     * * **history:** Utilizes the history api to prevent page reloads when possible.
     *
     * @default 'reload'
     */
    navigate?: ('reload'|'history');

    /**
     * Determines the level of verbosity of the logs.
     *
     * @default 'warn'
     */
    level?: ('error'|'warn'|'info'|'trace');
  }

  export interface ConnectedOptions {
    action?: string;
  }

  export interface OpenOptions {
    url: string;
    redirectUrl: string;
  }
}
