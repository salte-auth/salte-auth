import { v4 as uuidv4 } from 'uuid';

export class GUID {
  public static generate(prefix?: string): string {
    return [prefix, uuidv4()].filter(Boolean).join('-');
  }

  public static state(prefix?: string): string {
    return [prefix, GUID.generate('state')].filter(Boolean).join('-');
  }

  public static nonce(prefix?: string): string {
    return [prefix, GUID.generate('nonce')].filter(Boolean).join('-');
  }
}

