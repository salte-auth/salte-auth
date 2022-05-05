let setup = false;

type EventCallback = () => void;

const callbacks: EventCallback[] = [];
export declare interface SalteAuthEvent extends Event {
  detail?: any;
}

export declare interface CreateOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  detail?: any;
}

function onRouteChange() {
  callbacks.forEach((callback) => callback());
}

export class Events {
  public static route(callback: () => void): void {
    if (!setup) {
      window.addEventListener('popstate', onRouteChange, { passive: true });
      window.addEventListener('click', onRouteChange, { passive: true });
      setTimeout(onRouteChange);
      setup = true;
    }

    callbacks.push(callback);
  }

  public static create(name: string, params: CreateOptions): SalteAuthEvent {
    const event: SalteAuthEvent = document.createEvent('Event');
    event.initEvent(name, params.bubbles || false, params.cancelable || true);
    event.detail = params.detail;
    return event;
  }

  public static isCrossDomainError(e: Error): boolean {
    return e instanceof DOMException || e.message === 'Permission denied';
  }
}
