import { SalteAuthError } from './salte-auth-error';

import { Required } from './required';

import { Common } from '../../utils';

export abstract class Storage extends Required {
  constructor(config?: Storage.Config) {
    super(config);

    this.config = Common.defaults(this.config, {
      storage: 'session'
    });
  }

  public get(key: string, defaultValue: string = null): string {
    return this.storage.getItem(this.key(key)) || defaultValue;
  }

  public set(key: string, value?: any): void {
    if (Common.includes([undefined, null], value)) {
      this.clear(key);
    } else {
      this.storage.setItem(this.key(key), value);
    }
  }

  public clear(key: string) {
    this.storage.removeItem(this.key(key));
  }

  public reset(): void {
    const baseKey = this.key('');
    for (const key in localStorage) {
      if (key.indexOf(baseKey) === 0) {
        localStorage.removeItem(key);
      }
    }

    for (const key in sessionStorage) {
      if (key.indexOf(baseKey) === 0) {
        sessionStorage.removeItem(key);
      }
    }
  }

  protected key(key?: string): string {
    return `salte.auth.${key}`;
  }

  private get storage() {
    const storage = this.config && this.config.storage;

    switch (storage) {
      case 'local': return localStorage;
      case 'session': return sessionStorage;
    }

    throw new SalteAuthError({
      code: 'invalid_storage',
      message: `Storage doesn't exist for the given value. (${storage})`,
    });
  }
}

export interface Storage {
  config: Storage.Config;
};

export declare namespace Storage {
  export interface Config extends Required.Config {
    /**
     * The storage api to keep authenticate information stored in.
     *
     * @default 'session'
     */
    storage?: ('local'|'session');
  }
}
