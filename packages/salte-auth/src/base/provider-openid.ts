import { OAuth2Provider } from './provider-oauth2';

import { SalteAuthError } from './core/salte-auth-error';

import { Common, IDToken, Interceptors, GUID } from '../utils';

export class OpenIDProvider extends OAuth2Provider {
  public idToken?: IDToken;

  public constructor(config?: OpenIDProvider.Config) {
    super(config);

    this.config.renewal = typeof(this.config.renewal) === 'object' ? this.config.renewal : { type: this.config.renewal };

    this.config = Common.defaults(this.config, {
      responseType: 'id_token',
      scope: 'openid',
      renewal: {
        type: 'auto',
        buffer: 60000
      }
    });

    this.sync();
  }

  public async secure(request: Interceptors.XHR.ExtendedXMLHttpRequest | Request): Promise<'login' | boolean> {
    if (Common.includes(['id_token', 'id_token token', 'token'], this.config.responseType)) {
      if (this.idToken.expired) {
        this.logger.trace('[secure]: ID Token has expired, requesting login...');

        return 'login';
      }

      if (this.accessToken.expired) {
        await this.dedupe('access-token', async () => {
          this.logger.info(`[secure]: Expired access token detected, retrieving...`);

          const parsed = await Common.iframe({
            redirectUrl: this.redirectUrl('login'),
            url: this.$login({
              prompt: 'none',
              responseType: 'token',
            }),
          });

          this.logger.info(`[secure]: Access token retrieved! Validating...`);

          this.validate(parsed);
        })
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

  public $validate(options: OpenIDProvider.Validation): void {
    try {
      super.$validate(options);

      const { id_token, code } = options;
      if (id_token) {
        const { id_token } = options;

        const user = IDToken.parse(id_token);

        if (!user) {
          throw new SalteAuthError({
            code: 'invalid_id_token',
            message: 'Failed to parse user information due to invalid id token.',
          });
        }

        if (this.validation('nonce') && this.storage.get('nonce') !== user.nonce) {
          throw new SalteAuthError({
            code: 'invalid_nonce',
            message: 'Nonce provided by identity provider did not match the local nonce.',
          });
        }

        this.storage.set('id-token.raw', id_token);
      } else if (code) {
        this.storage.delete('id-token.raw');
      }
    } finally {
      this.storage.delete('nonce');
    }
  }

  public validate(options: OpenIDProvider.Validation): void {
    this.logger.trace('[validate] (options): ', options);

    try {
      this.$validate(options);
    } catch (error) {
      this.emit('login', error);
      throw error;
    } finally {
      this.sync();
    }

    const responseType = this.storage.get('response-type', '');
    const types = responseType.split(' ');
    if (Common.includes(types, 'id_token')) {
      this.emit('login', null, this.idToken);
    } else if (Common.includes(types, 'token')) {
      this.emit('login', null, this.accessToken);
    } else if (Common.includes(types, 'code')) {
      this.emit('login', null, this.code);
    } else {
      throw new SalteAuthError({
        code: 'invalid_response_type',
        message: `Unknown Response Type (${responseType})`
      });
    }
  }

  public $login(options?: OpenIDProvider.OverrideOptions): string {
    const nonce = GUID.nonce(this.$name);

    this.storage.set('nonce', nonce);

    return this.url(super.$login(options), {
      prompt: options && options.prompt,
      nonce
    });
  }

  public sync(): void {
    super.sync();
    this.logger.trace('[sync] updating id token');

    this.idToken = new IDToken(this.storage.get('id-token.raw'));
  }
}

export interface OpenIDProvider {
  config: OpenIDProvider.Config;

  // TODO: Fix this
  // on(name: 'login', listener: (error?: Error, user?: IDToken) => void): void;
  // on(name: 'logout', listener: (error?: Error) => void): void;
}

export declare namespace OpenIDProvider {
  export interface Config extends OAuth2Provider.Config {
    /**
     * Determines whether a authorization code (server) or id token (client) should be returned.
     */
    responseType?: ('id_token'|'id_token token'|'code');

    validation?: boolean | ValidationOptions;

    /**
     * Determines whether token renewal should be handled automatically or manually.
     *
     * @defaultValue 'auto'
     */
    renewal?: ('auto'|'manual'| {
      type?: ('auto'|'manual');
      /**
       * The amount of time prior to experation to renew the `id_token`.
       *
       * @defaultValue 60000
       */
      buffer?: number;
    });
  }

  export interface ValidationOptions extends OAuth2Provider.ValidationOptions {
    /**
     * Disables replay attack mitigation via "nonce".
     */
    nonce: boolean;
  }

  export interface OverrideOptions extends OAuth2Provider.OverrideOptions {
    /**
     * Indicate that the Provider shouldn't display any user interaction.
     */
    prompt?: ('none'|'login'|'consent'|'select_account');
  }

  export interface Validation extends OAuth2Provider.Validation {
    /**
     * A JSON Web Token (JWT) that contains user profile information
     */
    id_token: string;
  }
}
