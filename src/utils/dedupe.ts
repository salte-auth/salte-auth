export class Dedupe {
  public static dedupe(): Dedupe.Function {
    const dedupes: {
      [key: string]: Promise<any>;
    } = {};

    return <T>(key: string, fn: () => Promise<T>): Promise<T> => {
      if (!dedupes[key]) {
        dedupes[key] = fn().then((response) => {
          delete dedupes[key];
          return response;
        }).catch((error: any) => {
          delete dedupes[key];
          throw error;
        });
      }

      return dedupes[key];
    };
  }
}

export declare namespace Dedupe {
  /**
   * Prevents multiple active promises for a given key.
   * @param key - The key to dedupe
   * @param fn - A function that resolves to a promise.
   */
  type Function = <T>(key: string, fn: () => Promise<T>) => Promise<T>;
}
