import { OAuth2Provider } from './base/provider-oauth2';
import { OpenIDProvider } from './base/provider-openid';

export class OAuth2 extends OAuth2Provider {
  constructor(config: OAuth2.Config) {
    super(config);

    this.required('login');
  }

  get name(): string {
    return 'generic.oauth2';
  }

  get login(): string {
    return this.config.login.apply(this);
  }
}

export interface OAuth2 {
  config: OAuth2.Config;
};

export declare namespace OAuth2 {
  export interface Config extends OAuth2Provider.Config {
    login(): string;
  }
}

export class OpenID extends OpenIDProvider {
  constructor(config: OpenID.Config) {
    super(config);

    this.required('login', 'logout');
  }

  get name(): string {
    return 'generic.openid';
  }

  get login(): string {
    return this.config.login.apply(this);
  }

  get logout(): string {
    return this.config.logout.apply(this);
  }
}

export interface OpenID {
  config: OpenID.Config;
};

export declare namespace OpenID {
  export interface Config extends OpenIDProvider.Config {
    login(): string;
    logout(): string;
  }
}
