import { SalteAuthError } from './salte-auth-error';

import { Required } from './required';

import { Common, StorageHelpers } from '../../utils';

export class Storage extends Required {
  public storage: (StorageHelpers.CookieStorage | StorageHelpers.LocalStorage | StorageHelpers.SessionStorage);

  public constructor(config?: Storage.Config) {
    super(config);

    this.config = Common.defaults(this.config, {
      storage: StorageHelpers.CookieStorage.supported() ? 'cookie' : 'session'
    });

    const Storage = StorageHelpers.StorageTypes[this.config.storage];

    if (Storage) {
      this.storage = new Storage(this.key);
    } else {
      throw new SalteAuthError({
        code: 'invalid_storage',
        message: `Storage doesn't exist for the given value. (${this.config.storage})`,
      });
    }
  }

  protected get key(): string {
    return 'salte.auth';
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
     * Due to a known issue in Edge we recommend utilizing the default storage type.
     * https://github.com/AzureAD/azure-activedirectory-library-for-js/wiki/Known-issues-on-Edge
     *
     * @default 'cookie' or 'session' if cookies aren't enabled.
     */
    storage?: ('local'|'session'|'cookie');
  }
}
