import { URL } from './url';

const debounces: {
  [key: string]: number;
} = {};

export class Common {
  public static includes(source: any[] | string, value: any) {
    return source.indexOf(value) !== -1;
  }

  public static forEach<T>(source: T[], cb: (value: T, key: number | string) => void): void;
  public static forEach<T extends object>(source: T, cb: (item: any, key: number | string) => void): void;
  public static forEach<T>(source: T[] | T, cb: (item: T | any, key: number | string) => void): void {
    if (Array.isArray(source)) {
      for (let i = 0; i < source.length; i++) {
        cb(source[i], i);
      }
    } else {
      for (let key in source) {
        cb(source[key], key);
      }
    }
  }

  public static find<T>(source: T[], cb: (value: T, key: number | string) => boolean): T;
  public static find<T extends object>(source: T, cb: (item: any, key: number | string) => boolean): any;
  public static find<T>(source: T[] | T, cb: (item: T | any, key: number | string) => boolean): T | any {
    if (Array.isArray(source)) {
      for (let i = 0; i < source.length; i++) {
        const item = source[i];
        if (cb(item, i)) {
          return item;
        }
      }
    } else {
      for (let key in source) {
        const item = source[key];
        if (cb(item, key)) {
          return item;
        }
      }
    }

    return null;
  }

  public static assign(target: any, ...sources: any[]) {
    this.forEach(sources, (source) => {
      for (const key in source) {
        target[key] = source[key];
      }
    });

    return target;
  }

  public static defaults(target: any, ...sources: any[]) {
    this.forEach(sources, (source) => {
      for (const key in source) {
        if (target[key] !== undefined) continue;

        target[key] = source[key];
      }
    });

    return target;
  }

  public static async iframe({ url, redirectUrl, visible }: Common.IFrameOptions): Promise<any> {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('owner', '@salte-auth/salte-auth');

    if (visible) {
      this.assign(iframe.style, {
        border: 'none',
        bottom: 0,
        height: '100%',
        left: 0,
        position: 'fixed',
        right: 0,
        top: 0,
        width: '100%',
        zIndex: 9999,

        opacity: 0,
        transition: '0.5s opacity',
      });

      setTimeout(() => iframe.style.opacity = '1');
    } else {
      iframe.style.display = 'none';
    }

    iframe.src = url;
    document.body.appendChild(iframe);

    return new Promise((resolve, reject) => {
      const checker = setInterval(() => {
        try {
          const { location } = iframe.contentWindow;
          // This could throw cross-domain errors, so we need to silence them.
          if (location.href.indexOf(redirectUrl) !== 0) return;
          const parsed = URL.parse(location);

          iframe.parentElement && iframe.parentElement.removeChild(iframe);
          clearInterval(checker);
          resolve(parsed);
        } catch (e) {
          if (e instanceof DOMException || e.message === 'Permission denied') return;

          iframe.parentElement && iframe.parentElement.removeChild(iframe);
          clearInterval(checker);
          reject(e);
        }
      });
    });
  }

  public static debounce(identifier: string, callback: () => void, timeout?: number): void {
    clearTimeout(debounces[identifier]);

    debounces[identifier] = window.setTimeout(() => {
      delete debounces[identifier];

      callback();
    }, timeout);
  }
}

export declare namespace Common {
  export interface IFrameOptions {
    url: string;
    redirectUrl: string;
    visible?: boolean;
  }
}


