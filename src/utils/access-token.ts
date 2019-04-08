import { Common } from './common';

export class AccessToken {
  public raw: string;
  public expiration: number;
  public type: string;

  public constructor(accessToken: string, expiration: string, type: string) {
    this.raw = accessToken;
    this.expiration = Common.includes([undefined, null], expiration) ? null : Number(expiration);
    this.type = type;
  }

  public get expired() {
    return !this.raw || this.expiration <= Date.now();
  }
}
