import { Storage } from './core/storage';
import { Provider } from './core/provider';
import { Shared } from './core/shared';
import { Common, Logger } from '../utils';

export abstract class Handler extends Storage {
  protected logger: Logger;

  public constructor(config?: Handler.Config) {
    super(config);

    this.config = Common.defaults(this.config, {
      level: 'warn'
    });
    this.logger = new Logger(`@salte-auth/salte-auth:handlers/${this.$name}`, this.config.level);
  }

  public abstract open(options: Handler.OpenOptions): Promise<any>;

  /**
   * The unique name of the handler
   */
  public get $name() {
    return this.config.name || this.name;
  }

  /**
   * Returns a scoped key for storage.
   * @param key The storage key.
   *
   * @example redirect.key('hello') // 'salte.auth.handler.redirect.hello'
   */
  protected key(key: string) {
    return `salte.auth.handler.${this.$name}.${key}`;
  }

  /**
   * Navigates to the url provided.
   * @param url the url to navigate to
   */
  /* istanbul ignore next */
  protected navigate(url: string) {
    location.href = url;
  }

  /**
   * The unique name of the handler
   */
  protected abstract get name(): string;

  /**
   * Determines whether the handler supports automatic login.
   */
  public abstract get auto(): boolean;
}

export interface Handler {
  config: Handler.Config;

  connected?(options: Handler.ConnectedOptions): void;
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
     * Determines the level of verbosity of the logs.
     *
     * @default 'warn'
     */
    level?: ('error'|'warn'|'info'|'trace');
  }

  export interface ConnectedOptions {
    action?: string;
    handler?: string;
    provider?: Provider;
  }

  export interface OpenOptions {
    url: string;
    redirectUrl: string | Shared.RedirectUrl;
    auto?: boolean;
  }
}
