import { SalteAuth } from '../salte-auth';

export type SalteAuthMixedIn<T = {
  auth: SalteAuth;
}> = new (...args: any[]) => T;

export type Constructor<T = {
  requestUpdate?(): void;
}> = new (...args: any[]) => T;

export function AuthMixinGenerator(auth: SalteAuth) {
  return function<TBase extends Constructor>(Base: TBase): SalteAuthMixedIn {
    return class extends Base {
      public auth: SalteAuth;

      public constructor(...args: any[]) {
        super(...args);

        this.auth = auth;

        this.auth.on('login', () => {
          if (this.requestUpdate) this.requestUpdate();
        });

        this.auth.on('logout', () => {
          if (this.requestUpdate) this.requestUpdate();
        });
      }
    };
  };
}
