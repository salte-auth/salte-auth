import { Shared } from './shared';

import { Common, Interceptors, Logger } from '../../utils';

export abstract class Provider extends Shared {
  protected logger: Logger;

  constructor(config: Provider.Config) {
    super(config);

    this.config = Common.defaults(this.config, {
      validation: true,
      level: 'warn'
    });
    this.logger = new Logger(`@salte-auth/salte-auth:providers/${this.$name}`, this.config.level);
  }

  /**
   * An internal login command to `salte-auth` that enables enhancing the login with common parameters.
   */
  public abstract $login(options?: Provider.OverrideOptions): string;

  /**
   * Checks for errors returned from the provider.
   * @returns true if validation is enabled, false otherwise.
   */
  protected abstract $validate(options: object): void;

  public abstract validate(options: object): void;

  /**
   * Determines if validation is enabled for the given key.
   * @param key the key to determine whether validation is enabled for
   * @returns whether validation is enabled for the key.
   */
  protected validation(key: string): boolean {
    if (typeof(this.config.validation) === 'object') {
      return this.config.validation[key] === true;
    }

    return this.config.validation === true;
  }

  /**
   * The unique name of the provider
   */
  public get $name(): string {
    return this.config.name || this.name;
  }

  /**
   * Returns a scoped key for storage.
   * @param key The storage key.
   *
   * @example auth0.key('hello') // 'salte.auth.provider.auth0.hello'
   */
  protected key(key: string) {
    return `salte.auth.provider.${this.$name}.${key}`;
  }

  /**
   * Creates a url with the given query parameters
   * @param base the base url without query parameters
   * @param params the query parameters to attache to the url
   * @returns the built url
   */
  protected url(base: string, params: object = {}): string {
    let url = base;

    Common.forEach(params, (value, key) => {
      if (Common.includes([undefined, null, ''], value)) return;

      url += `${url.indexOf('?') === -1 ? '?' : '&'}${key}=${encodeURIComponent(value)}`;
    });

    return url;
  }

  /**
   * The unique name of the provider
   */
  protected abstract get name(): string;

  /**
   * Returns the login url for the provider.
   */
  protected abstract get login(): string;

  /**
   * Returns the logout url for the provider.
   */
  public abstract get logout(): string;
}

export interface Provider {
  /**
   * Invoked when Salte Auth is initialized
   */
  connected?(): void;

  /**
   * Invoked when an endpoint is marked as secured.
   * @returns true if the endpoint is already secured, otherwise it returns a url to secure the endpoint.
   */
  secure?(request?: Interceptors.XHR.ExtendedXMLHttpRequest | Request): Promise<string | boolean>;

  on(name: 'login', listener: (error?: Error, data?: any) => void): void
  on(name: 'logout', listener: (error?: Error) => void): void
}

export interface Provider {
  config: Provider.Config;
};

export declare namespace Provider {
  export interface Config extends Shared.Config {
    /**
     * The name associated with your provider
     */
    name?: string;

    /**
     * The url of the designated provider.
     */
    url?: string;

    /**
     * Used to disable certain security validations if your provider doesn't support them.
     *
     * @default true
     */
    validation?: ValidationOptions | boolean;

    /**
     * The routes to secure for this provider.
     */
    routes?: Array<string | RegExp> | boolean;

    /**
     * The endpoints to secure for this provider.
     */
    endpoints?: Array<string | RegExp>;

    /**
     * Determines the level of verbosity of the logs.
     *
     * @default 'warn'
     */
    level?: ('error'|'warn'|'info'|'trace');
  }

  export interface OverrideOptions {}

  export interface ValidationOptions {
    [key: string]: boolean;
  }
}
