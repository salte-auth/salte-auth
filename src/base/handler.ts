import debug from 'debug';

import { Storage } from './core/storage';
import { Provider } from './core/provider';
import { Shared } from './core/shared';

export abstract class Handler extends Storage {
  protected logger: debug.Debugger;

  public constructor(config: Handler.Config = {}) {
    super(config);

    this.logger = debug(`@salte-auth/salte-auth/handlers/${this.$name}`);
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
  connected?(options: Handler.ConnectedOptions): void;
}

export declare namespace Handler {
  interface Config extends Storage.Config {
    name?: string;
    default?: boolean;
  }

  interface ConnectedOptions {
    action?: string;
    handler?: string;
    provider?: Provider;
  }

  interface OpenOptions {
    url: string;
    redirectUrl: string | Shared.RedirectUrl;
    auto?: boolean;
  }
}
