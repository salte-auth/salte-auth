export class AccessToken {
  public raw: string;
  public expiration: number;
  public type: string;

  public constructor(accessToken: string, expiration: number, type: string) {
    this.raw = accessToken;
    this.expiration = expiration;
    this.type = type;
  }

  public get expired() {
    return !this.raw || this.expiration <= Date.now();
  }
}
