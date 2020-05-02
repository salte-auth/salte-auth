import { AuthMixinGenerator, SalteAuthMixedIn, Constructor } from './mixins/auth';
import { Shared } from './base/core/shared';
import * as Generic from './generic';
import * as Utils from './utils';
import { Common, Events, Interceptors, URL, IDToken, Logger } from './utils';

import { Provider } from './base/core/provider';
import { SalteAuthError } from './base/core/salte-auth-error';
import { Handler } from './base/handler';

export class SalteAuth extends Shared {
  public logger: Logger;
  public mixin: (base: Constructor) => SalteAuthMixedIn;

  public constructor(config: SalteAuth.Config) {
    super(config);

    this.required('providers', 'handlers');

    this.config = Common.defaults(this.config, {
      validation: true,
      level: 'warn'
    });

    this.logger = new Logger(`@salte-auth/salte-auth:core`, this.config.level);

    Common.forEach(this.config.providers, (provider) => {
      provider.connected && provider.connected();

      provider.on('login', (error, data) => {
        this.emit('login', error, {
          provider: provider.name,
          data: data
        });
      });

      provider.on('logout', (error) => {
        this.emit('logout', error, {
          provider: provider.name
        });
      });
    });

    const action = this.storage.get('action');
    const provider = action ? this.provider(this.storage.get('provider')) : null;
    const handlerName = action ? this.storage.get('handler') : null;

    if (!Common.includes([undefined, null, 'login', 'logout'], action)) {
      throw new SalteAuthError({
        code: 'unknown_action',
        message: `Unable to finish redirect due to an unknown action! (${action})`,
      });
    }

    Common.forEach(this.config.handlers, (handler) => {
      if (!handler.connected) return;

      const responsible = handler.$name === handlerName;

      setTimeout(() => {
        const parsed = handler.connected({ action: responsible ? action : null });

        if (!responsible) return;

        if (action === 'login') {
          provider.validate(parsed);
          this.logger.info('[constructor]: login complete');
        } else {
          provider.storage.clear();
          provider.sync();
          provider.emit('logout');
          this.logger.info('[constructor]: logout complete');
        }
      });
    });

    this.storage.delete('action');
    this.storage.delete('provider');
    this.storage.delete('handler');

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

                this.storage.set('action', 'login');
                this.storage.set('provider', provider.$name);
                this.storage.set('handler', handler.$name);

                const params = await handler.open({
                  redirectUrl: provider.redirectUrl('login'),
                  url: response,
                });

                provider.validate(params);

                this.storage.delete('action');
                this.storage.delete('provider');
                this.storage.delete('handler');
              }
            }
          }
        }
      } catch (error) {
        this.storage.delete('action');
        this.storage.delete('provider');
        this.storage.delete('handler');
        throw error;
      }
    });

    this.mixin = AuthMixinGenerator(this);
  }

  /**
   * Login to the specified provider.
   *
   * @param options - the authentication options
   */
  public async login(options: SalteAuth.AuthOptions): Promise<void>;
  /**
   * Login to the specified provider.
   *
   * @param provider - the provider to login with
   */
  public async login(provider: string): Promise<void>;
  public async login(options: SalteAuth.AuthOptions | string): Promise<void> {
    options = typeof(options) === 'string' ? { provider: options } : options;

    try {
      const provider = this.provider(options.provider);
      const handler = this.handler(options.handler);

      this.storage.set('action', 'login');
      this.storage.set('provider', provider.$name);
      this.storage.set('handler', handler.$name);

      this.logger.info(`[login]: logging in with ${provider.$name} via ${handler.$name}...`);
      const params = await handler.open({
        redirectUrl: provider.redirectUrl('login'),
        url: provider.$login(),
      });

      provider.validate(params);
      this.logger.info('[login]: login complete');
    } finally {
      this.storage.delete('action');
      this.storage.delete('provider');
      this.storage.delete('handler');
    }
  }

  /**
   * Logout of the specified provider.
   *
   * @param options - the authentication options
   */
  public async logout(options: SalteAuth.AuthOptions): Promise<void>;
  /**
   * Logout of the specified provider.
   *
   * @param provider - the provider to logout of
   */
  public async logout(provider: string): Promise<void>;
  public async logout(options: SalteAuth.AuthOptions | string): Promise<void> {
    options = typeof(options) === 'string' ? { provider: options } : options;

    const provider = this.provider(options.provider);
    try {
      const handler = this.handler(options.handler);

      this.storage.set('action', 'logout');
      this.storage.set('provider', provider.$name);
      this.storage.set('handler', handler.$name);

      this.logger.info(`[logout]: logging out with ${provider.$name} via ${handler.$name}...`);
      await handler.open({
        redirectUrl: provider.redirectUrl('logout'),
        url: provider.logout,
      });

      provider.storage.clear();
      provider.sync();
      provider.emit('logout');
      this.logger.info('[logout]: logout complete');
    } catch (error) {
      provider.emit('logout', error);
      throw error;
    } finally {
      this.storage.delete('action');
      this.storage.delete('provider');
      this.storage.delete('handler');
    }
  }

  /**
   * Returns a provider that matches the given name.
   * @param name - the name of the provider
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
   * @param name - the name of the handler
   * @returns the handler with the given name, if no name is specified then the default handler.
   */
  public handler(name?: string): Handler {
    const handler = name === undefined ?
      Common.find(this.config.handlers, (handler) => Boolean(handler.config.default)) :
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
  emit(name: 'login'|'logout', error?: Error, data?: SalteAuth.EventWrapper): void;
}

export declare namespace SalteAuth {
  interface Config extends Shared.Config {
    providers: Provider[];

    handlers: Handler[];

    /**
     * Determines the level of verbosity of the logs.
     *
     * @defaultValue 'warn'
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
