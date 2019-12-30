import { Common } from '../common';
import { Storage } from './storage';

export class CookieStorage extends Storage {
  /**
   * Determines if the current browser allows cookies.
   * @returns true if cookies aren't disabled.
   */
  public static supported() {
    return navigator.cookieEnabled === true;
  }

  public get(name: string, defaultValue?: string) {
    const match = document.cookie.match(new RegExp(`${this.key(name)}=([^;]+)`));
    const result = match && match[1].trim();

    if (!Common.includes([undefined, null], result)) return result;
    else if (!Common.includes([undefined, null], defaultValue)) return defaultValue;

    return null;
  }

  public set(name: string, value: any) {
    if (Common.includes([undefined, null], value)) {
      this.delete(name);
    } else {
      document.cookie = `${this.key(name)}=${value}; SameSite=Lax`;
    }
  }

  public delete(name: string) {
    document.cookie = `${this.key(name)}=; expires=${new Date(0).toUTCString()}`
  }

  public clear() {
    const base = this.key();

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name] = cookie.trim().split('=');

      if (name.indexOf(base) === 0) {
        this.delete(name);
      }
    }
  }
}
