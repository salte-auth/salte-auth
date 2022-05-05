export class Fetch {
  static real: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  static hasSetup = false;
  static interceptors: Function[];

  static setup(force?: boolean) {
    if (this.hasSetup && !force) return;
    this.hasSetup = true;
    this.interceptors = [];

    if (!this.real) this.real = window.fetch;

    if (window.fetch) {
      window.fetch = async function(input, options) {
        const request = input instanceof Request ? input : new Request(input, options);

        for (let i = 0; i < Fetch.interceptors.length; i++) {
          const interceptor = Fetch.interceptors[i];

          await Promise.resolve(interceptor(request));
        }

        return Fetch.real.call(this, request);
      };
    }
  }

  static add(interceptor: (request: Request) => void) {
    this.setup();

    this.interceptors.push(interceptor);
  }
}

