import { Events } from '../events';

export class XHR {
  static realOpen: (method: string, url: string) => void;
  static realSend: (body?: Document | BodyInit | null) => void;
  static hasSetup = false;
  static interceptors: Function[];

  public static setup(force?: boolean) {
    if (this.hasSetup && !force) return;
    this.hasSetup = true;
    this.interceptors = [];

    if (!this.realOpen) this.realOpen = XMLHttpRequest.prototype.open;
    if (!this.realSend) this.realSend = XMLHttpRequest.prototype.send;

    const requestPrototype: XHR.ExtendedXMLHttpRequest = XMLHttpRequest.prototype;
    requestPrototype.open = function(...args: any) {
      const [, url] = args;
      this.$url = url;
      return XHR.realOpen.apply(this, args);
    };

    requestPrototype.send = function(data) {
      const promises = [];
      for (let i = 0; i < XHR.interceptors.length; i++) {
        const interceptor = XHR.interceptors[i];

        promises.push(interceptor(this, data));
      }

      Promise.all(promises).then(() => {
        XHR.realSend.call(this, data);
      }).catch((error) => {
        this.dispatchEvent(Events.create('error', {
          detail: error
        }));
      });
    };
  }

  public static add(interceptor: (request: XHR.ExtendedXMLHttpRequest, data?: string | Document | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | null) => void) {
    this.setup();

    this.interceptors.push(interceptor);
  }
}

export declare namespace XHR {
  export interface ExtendedXMLHttpRequest extends XMLHttpRequest {
    $url?: string;
  }
}
