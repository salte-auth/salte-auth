import nanoid from 'nanoid';

import { AccessToken, Common, Interceptors } from '../utils';
import { Provider } from './core/provider';
import { SalteAuthError } from './core/salte-auth-error';

export class OAuth2Provider extends Provider {
  public accessToken?: AccessToken;

  public constructor(config?: OAuth2Provider.Config) {
    super(config);

    this.sync();
  }

  public connected(): void {
    this.required('clientID', 'responseType');
  }

  public async secure(request: Interceptors.XHR.ExtendedXMLHttpRequest | Request): Promise<'login' | boolean> {
    if (this.config.responseType === 'token') {
      if (this.accessToken.expired) {
        return 'login';
      }

      if (request) {
        if (request instanceof Request) {
          request.headers.set('Authorization', `Bearer ${this.accessToken.raw}`);
        } else if (request instanceof XMLHttpRequest) {
          request.setRequestHeader('Authorization', `Bearer ${this.accessToken.raw}`);
        } else {
          throw new SalteAuthError({
            code: 'unknown_request',
            message: `Unknown request type. (${request})`,
          });
        }
      }
    }

    return true;
  }

  public $validate(options: OAuth2Provider.Validation): void {
    try {
      if (!options) {
        throw new SalteAuthError({
          code: 'empty_response',
          message: `The response provided was empty, this is most likely due to the configured handler not providing it.`
        });
      }

      if (options.error) {
        throw new SalteAuthError({
          code: options.error,
          message: `${options.error_description ? options.error_description : options.error}${options.error_uri ? ` (${options.error_uri})` : ''}`,
        });
      }

      const { code, access_token, state, expires_in, token_type } = options;

      if (this.validation('state') && this.storage.get('state') !== state) {
        throw new SalteAuthError({
          code: 'invalid_state',
          message: 'State provided by identity provider did not match local state.',
        });
      }

      const types = this.storage.get('response-type', '').split(' ');
      if (Common.includes(types, 'code')) {
        if (!code) {
          throw new SalteAuthError({
            code: 'invalid_code',
            message: 'Expected a code to be returned by the Provider.',
          });
        }
      } else if (Common.includes(types, 'token')) {
        if (!access_token) {
          throw new SalteAuthError({
            code: 'invalid_access_token',
            message: 'Expected an access token to be returned by the Provider.',
          });
        }
      }

      if (code) {
        this.storage.set('code.raw', code);
        this.storage.delete('access-token.raw');
        this.storage.delete('access-token.expiration');
        this.storage.delete('access-token.type');
      } else if (access_token) {
        this.storage.set('access-token.raw', access_token);
        this.storage.set('access-token.expiration', Date.now() + (Number(expires_in) * 1000));
        this.storage.set('access-token.type', token_type);
        this.storage.delete('code.raw');
      }
    } finally {
      this.storage.delete('state');
    }
  }

  public validate(options: OAuth2Provider.Validation): void {
    this.logger.trace('[validate] (options): ', options);

    try {
      this.$validate(options);
    } catch (error) {
      this.emit('login', error);
      throw error;
    } finally {
      this.sync();
    }

    this.emit('login', null, this.code || this.accessToken);
  }

  public get code(): string {
    return this.storage.get('code.raw');
  }

  public $login(options: OAuth2Provider.OverrideOptions = {}): string {
    const state = `${this.$name}-state-${nanoid()}`;
    const responseType = options.responseType || this.config.responseType;

    this.storage.set('state', state);
    this.storage.set('response-type', responseType);

    return this.url(this.login, {
      ...this.config.queryParams && this.config.queryParams('login'),
      client_id: this.config.clientID,
      response_type: responseType,
      redirect_uri: this.redirectUrl('login'),
      scope: this.config.scope,
      state,
    });
  }

  public sync(): void {
    this.logger.trace('[sync] updating access token');

    this.accessToken = new AccessToken(
      this.storage.get('access-token.raw'),
      this.storage.get('access-token.expiration'),
      this.storage.get('access-token.type')
    );
  }
}

export interface OAuth2Provider {
  config: OAuth2Provider.Config;

  on(name: 'login', listener: (error?: Error, accessToken?: AccessToken) => void): void;
  on(name: 'login', listener: (error?: Error, code?: string) => void): void;
  on(name: 'logout', listener: (error?: Error) => void): void;
}

export declare namespace OAuth2Provider {
  export interface Config extends Provider.Config {
    // TODO: Need to figure how to fix this, might require separating OpenIDProvider from OAuth2Provider...
    /* eslint-disable tsdoc/syntax */
    /**
     * Determines whether a authorization code (server) or access token (client) should be returned.
     * @type {('code'|'token')}
     */
    responseType?: string;
    /* eslint-enable tsdoc/syntax */

    /**
     * A list of space-delimited claims used to determine what user information is provided and what access is given.
     */
    scope?: string;

    /**
     * The client id of your identity provider
     */
    clientID: string;

    validation?: boolean | ValidationOptions;
  }

  export interface OverrideOptions {
    // TODO: Need to figure how to fix this, might require separating OpenIDProvider from OAuth2Provider...
    /* eslint-disable tsdoc/syntax */
    /**
     * Determines whether a authorization code (server) or access token (client) should be returned.
     * @type {('code'|'token')}
     */
    responseType?: string;
    /* eslint-enable tsdoc/syntax */
  }

  export interface ValidationOptions extends Provider.ValidationOptions {
    /**
     * Disables cross-site forgery validation via "state".
     */
    state: boolean;
  }

  export interface Validation {
    /**
     * An error code sent from the Provider
     */
    error: ('unauthorized_client'|'access_denied'|'unsupported_response_type'|'invalid_scope'|'server_error'|'temporarily_unavailable');

    /**
     * Human-readable message sent back by the Provider.
     */
    error_description?: string;

    /**
     * A URI to a human-readable web page with information about the error.
     */
    error_uri?: string;

    /**
     * A value sent back by the server to the client.
     *
     * Used to prevent cross-site request forgery.
     */
    state: string;

    /**
     * The authorization code generated by the Provider.
     *
     * Generally used by a backend server to generate an access token.
     */
    code: string;

    /**
     * The access token issued by the Provider.
     */
    access_token: string;

    /**
     * The type of the token issued.
     */
    token_type: ('bearer'|'mac');

    /**
     * The lifetime (in seconds) of the access_token.
     *
     * For example, the value "3600" denotes that the access token will
     * expire in one hour from the time the response was generated.
     */
    expires_in: string;
  }
}
