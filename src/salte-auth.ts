
import { Shared } from './base/core/shared';
import * as Generic from './generic';
import * as Utils from './utils';
import { Common, Events, Interceptors, URL, IDToken, Logger } from './utils';

import { Provider } from './base/core/provider';
import { SalteAuthError } from './base/core/salte-auth-error';
import { Handler } from './base/handler';

export class SalteAuth extends Shared {
  public logger: Logger;

  constructor(config: SalteAuth.Config) {
    super(config);

    this.required('providers', 'handlers');

    this.config = Common.defaults(this.config, {
      validation: true,
      level: 'warn'
    });

    this.logger = new Logger(`@salte-auth/salte-auth:core`, this.config.level);

    Common.forEach(this.config.providers, (provider) => {
      provider.config = Common.defaults(provider.config, this.config);
      provider.connected && provider.connected();

      provider.on('login', (error, data) => {
        this.emit('login', error, data);
      });

      provider.on('logout', (error) => {
        this.emit('logout', error);
      });
    });

    const name = this.get('provider');
    const provider = name ? this.provider(name) : null;

    Common.forEach(this.config.handlers, (handler) => {
      handler.config = Common.defaults(handler.config, this.config);
      handler.connected && handler.connected({
        action: this.get('action'),
        handler: this.get('handler'),
        provider,
      });
    });

    this.clear('action');
    this.clear('provider');
    this.clear('handler');

    Interceptors.Fetch.add(async (request) => {
      for (let i = 0; i < this.config.providers.length; i++) {
        const provider = this.config.providers[i];

        if (URL.match(request.url, provider.config.endpoints)) {
          provider.secure && await provider.secure(request);
        }
      }
    });

    Interceptors.XHR.add(async (request) => {
      for (let i = 0; i < this.config.providers.length; i++) {
        const provider = this.config.providers[i];

        if (URL.match(request.$url, provider.config.endpoints)) {
          provider.secure && await provider.secure(request);
        }
      }
    });

    Events.route(async () => {
      try {
        const handler = this.handler();

        for (let i = 0; i < this.config.providers.length; i++) {
          const provider = this.config.providers[i];

          if (URL.match(location.href, provider.config.routes)) {
            let response: string | boolean = null;

            while (response !== true) {
              response = await provider.secure();

              if (typeof(response) === 'string') {
                if (!handler.auto) {
                  throw new SalteAuthError({
                    code: 'auto_unsupported',
                    message: `The default handler doesn't support automatic authentication! (${handler.$name})`,
                  });
                }

                this.set('action', 'login');
                this.set('provider', provider.$name);
                this.set('handler', handler.$name);

                const params = await handler.open({
                  redirectUrl: provider.config.redirectUrl,
                  url: response,
                });

                provider.validate(params);

                this.clear('action');
                this.clear('provider');
                this.clear('handler');
              }
            }
          }
        }
      } catch (error) {
        this.clear('action');
        this.clear('provider');
        this.clear('handler');
        throw error;
      }
    });
  }

  /**
   * Login to the specified provider.
   *
   * @param options the authentication options
   */
  public async login(options: SalteAuth.AuthOptions): Promise<void>;
  /**
   * Login to the specified provider.
   *
   * @param provider the provider to login with
   */
  public async login(provider: string): Promise<void>;
  public async login(options: SalteAuth.AuthOptions | string): Promise<void> {
    options = typeof(options) === 'string' ? { provider: options } : options;

    try {
      const provider = this.provider(options.provider);
      const handler = this.handler(options.handler);

      this.set('action', 'login');
      this.set('provider', provider.$name);
      this.set('handler', handler.$name);

      const params = await handler.open({
        redirectUrl: provider.config.redirectUrl,
        url: provider.$login(),
      });

      provider.validate(params);
    } finally {
      this.clear('action');
      this.clear('provider');
      this.clear('handler');
    }
  }

  /**
   * Logout of the specified provider.
   *
   * @param options the authentication options
   */
  public async logout(options: SalteAuth.AuthOptions): Promise<void>;
  /**
   * Logout of the specified provider.
   *
   * @param provider the provider to logout of
   */
  public async logout(provider: string): Promise<void>;
  public async logout(options: SalteAuth.AuthOptions | string): Promise<void> {
    options = typeof(options) === 'string' ? { provider: options } : options;

    const provider = this.provider(options.provider);
    try {
      const handler = this.handler(options.handler);

      this.set('action', 'logout');
      this.set('provider', provider.$name);
      this.set('handler', handler.$name);

      await handler.open({
        redirectUrl: provider.config.redirectUrl,
        url: provider.logout,
      });

      provider.reset();
      provider.emit('logout');
    } catch (error) {
      provider.emit('logout', error);
      throw error;
    } finally {
      this.clear('action');
      this.clear('provider');
      this.clear('handler');
    }
  }

  /**
   * Returns a provider that matches the given name.
   * @param name the name of the provider
   * @returns the provider with the given name.
   */
  public provider(name?: string): Provider {
    const provider = Common.find(this.config.providers, (provider) => provider.$name === name);

    if (!provider) {
      throw new SalteAuthError({
        code: 'invalid_provider',
        message: `Unable to locate provider with the given name. (${name})`,
      });
    }

    return provider;
  }

  /**
   * Returns a handler that matches the given name.
   * @param name the name of the handler
   * @returns the handler with the given name, if no name is specified then the default handler.
   */
  public handler(name?: string): Handler {
    const handler = name === undefined ?
      Common.find(this.config.handlers, (handler) => !!handler.config.default) :
      Common.find(this.config.handlers, (handler) => handler.$name === name)

    if (!handler) {
      throw new SalteAuthError({
        code: 'invalid_handler',
        message: `Unable to locate handler with the given name. (${name})`,
      });
    }

    return handler;
  }
}

export interface SalteAuth {
  config: SalteAuth.Config;
  on(name: 'login', listener: (error?: Error, data?: SalteAuth.EventWrapper) => void): void;
  on(name: 'logout', listener: (error?: Error, data?: SalteAuth.EventWrapper) => void): void;
}

export declare namespace SalteAuth {
  interface Config extends Shared.Config {
    providers: Provider[];

    handlers: Handler[];

    /**
     * Determines the level of verbosity of the logs.
     *
     * @default 'warn'
     */
    level?: ('error'|'warn'|'info'|'trace');
  }

  interface EventWrapper {
    provider: string;
    data?: IDToken.UserInfo | string;
  }

  interface AuthOptions {
    provider: string;
    handler?: string;
  }
}

export { SalteAuthError } from './base/core/salte-auth-error';
export { OAuth2Provider } from './base/provider-oauth2';
export { OpenIDProvider } from './base/provider-openid';
export { Handler, Utils, Generic };
