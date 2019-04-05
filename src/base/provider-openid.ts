import nanoid from 'nanoid';

import { OAuth2Provider } from './provider-oauth2';

import { SalteAuthError } from './core/salte-auth-error';

import { Common, IDToken, Interceptors } from '../utils';

export abstract class OpenIDProvider extends OAuth2Provider {
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
  }

  public async secure(request: Interceptors.XHR.ExtendedXMLHttpRequest | Request): Promise<string | boolean> {
    if (Common.includes(['id_token', 'id_token token', 'token'], this.config.responseType)) {
      if (this.idToken().expired) {
        return this.$login();
      }

      if (this.accessToken().expired) {
        const parsed = await Common.iframe({
          redirectUrl: this.redirectUrl('login'),
          url: this.$login({
            prompt: 'none',
            responseType: 'token',
          }),
        });

        this.validate(parsed);
      }

      if (request) {
        if (request instanceof Request) {
          request.headers.set('Authorization', `Bearer ${this.accessToken().raw}`);
        } else if (request instanceof XMLHttpRequest) {
          request.setRequestHeader('Authorization', `Bearer ${this.accessToken().raw}`);
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

  protected $validate(options: OpenIDProvider.Validation): void {
    try {
      super.$validate(options);

      const types = this.get('response-type', '').split(' ');
      if (Common.includes(types, 'id_token')) {
        const { id_token } = options;

        const user = IDToken.parse(id_token);

        if (!user) {
          throw new SalteAuthError({
            code: 'invalid_id_token',
            message: 'Failed to parse user information due to invalid id token.',
          });
        }

        if (this.validation('nonce') && this.get('nonce') !== user.nonce) {
          throw new SalteAuthError({
            code: 'invalid_nonce',
            message: 'Nonce provided by identity provider did not match the local nonce.',
          });
        }

        this.set('id-token.raw', id_token);
      }
    } finally {
      this.clear('nonce');
    }
  }

  public validate(options: OpenIDProvider.Validation): any {
    try {
      this.$validate(options);
    } catch (error) {
      this.emit('login', error);
      throw error;
    }

    this.emit('login', null, this.code || this.idToken());
  }

  public idToken(): IDToken {
    return new IDToken(this.get('id-token.raw'));
  }

  public $login(options?: OpenIDProvider.OverrideOptions): string {
    const nonce = `${this.$name}-nonce-${nanoid()}`;

    this.set('nonce', nonce);

    return this.url(super.$login(options), {
      prompt: options && options.prompt,
      nonce
    });
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
     * @default 'auto'
     */
    renewal?: ('auto'|'manual'| {
      type?: ('auto'|'manual');
      /**
       * The amount of time prior to experation to renew the `id_token`.
       *
       * @default 60000
       */
      buffer?: number
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
