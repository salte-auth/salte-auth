import { SalteAuthError } from './salte-auth-error';

export abstract class Required {
  constructor(config?: Required.Config) {
    this.config = config || {};
  }

  protected required(...keys: string[]): void {
    const missing = keys.filter((key: string) => {
      return this.config[key] === undefined;
    });

    if (missing.length > 0) {
      throw new SalteAuthError({
        code: 'missing_required_properties',
        message: `Missing the following required fields. (${missing.join(', ')})`,
      });
    }
  }
}

export interface Required {
  config: Required.Config;
};

export declare namespace Required {
  export interface Config {
    [key: string]: any;
  }
}
