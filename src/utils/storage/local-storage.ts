import { Common } from '../common';
import { Storage } from './storage';

export class LocalStorage extends Storage {
  public get(name: string, defaultValue?: string) {
    const result = localStorage.getItem(this.key(name));

    if (!Common.includes([undefined, null], result)) return result;
    else if (!Common.includes([undefined, null], defaultValue)) return defaultValue;

    return null;
  }

  public set(name: string, value: any) {
    if (Common.includes([undefined, null], value)) {
      this.delete(name);
    } else {
      localStorage.setItem(this.key(name), value);
    }
  }

  public delete(name: string) {
    localStorage.removeItem(this.key(name));
  }

  public clear() {
    const base = this.key();

    for (const key in localStorage) {
      if (key.indexOf(base) === 0) {
        this.delete(key);
      }
    }
  }
}
