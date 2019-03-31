import { Storage } from './storage';
import { Common } from '../../utils';

export abstract class Events extends Storage {
  private listeners: Map<string, Function[]> = new Map();

  public on(name: string, listener: Function) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, []);
    }

    const listeners = this.listeners.get(name);
    listeners.push(listener);
  }

  public off(name: string, listener: Function) {
    if (!this.listeners.has(name)) return;
    const listeners = this.listeners.get(name);

    if (!listeners.length) return;
    const index = listeners.indexOf(listener);

    if (index === -1) return;
    listeners.splice(index, 1);
  }

  public emit(name: string, ...args: any[]) {
    if (!this.listeners.has(name)) return;

    const listeners = this.listeners.get(name);

    Common.forEach(listeners, (listener) => listener(...args));
  }
}

export interface Events {
  config: Events.Config;
};

export declare namespace Events {
  export interface Config extends Storage.Config {}
}
