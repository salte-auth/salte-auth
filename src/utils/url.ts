import { Common } from './common';

let urlDocument: Document;
let base: HTMLBaseElement;
let anchor: HTMLAnchorElement;

export class URL {
  /**
   * Outputs a result equivalent to `location.origin`
   */
  public static get origin(): string {
    return `${location.protocol}//${location.host}`;
  }

  public static resolve(path: string): string {
    if (!urlDocument) {
      urlDocument = document.implementation.createHTMLDocument('url');
      base = urlDocument.createElement('base');
      anchor = urlDocument.createElement('a');
      urlDocument.head.appendChild(base);
    }
    base.href = window.location.protocol + '//' + window.location.host;
    anchor.href = path.replace(/ /g, '%20');
    return anchor.href.replace(/\/$/, '');
  }

  public static match(url: string, tests: (string | RegExp)[] | boolean): boolean {
    if (tests instanceof Array) {
      const resolvedUrl = this.resolve(url);

      const match = Common.find(tests, (test) => {
        if (test instanceof RegExp) {
          return !!resolvedUrl.match(test);
        }

        return resolvedUrl.indexOf(this.resolve(test)) === 0;
      });

      return !!match;
    }

    return tests === true;
  }

  public static parse({ search, hash }: Location): any {
    let params: string[] = [];

    if (search) params = params.concat(search.replace('?', '').split('&'));
    if (hash) params = params.concat(hash.replace('#', '').split('&'));

    const parsed: any = {};

    Common.forEach(params, (param) => {
      const [key, value] = param.split('=');

      parsed[key] = value;
    });

    return parsed;
  }

  /**
   * Creates a url with the given query parameters
   * @param base - the base url without query parameters
   * @param params - the query parameters to attache to the url
   * @returns the built url
   */
  public static url(base: string, params?: { [key: string]: any }): string {
    let url = base;

    Common.forEach(params, (value, key) => {
      if (Common.includes([undefined, null, ''], value)) return;

      url += `${url.indexOf('?') === -1 ? '?' : '&'}${key}=${encodeURIComponent(value)}`;
    });

    return url;
  }
}
