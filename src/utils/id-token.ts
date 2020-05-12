import { SalteAuthError } from '../base/core/salte-auth-error';

export class IDToken {
  public raw: string;
  public user: IDToken.UserInfo;

  public constructor(idToken: string) {
    this.raw = idToken;
    this.user = IDToken.parse(this.raw);
  }

  public get expired() {
    return !this.user || (this.user.exp * 1000) <= Date.now();
  }

  public static parse(idToken?: string): IDToken.UserInfo | null {
    try {
      const separated = idToken.split('.');

      if (separated.length !== 3) {
        throw new SalteAuthError({
          code: 'invalid_id_token',
          message: `ID Token didn't match the desired format. ({header}.{payload}.{validation})`,
        });
      }

      // This fixes an issue where various providers will encode values
      // incorrectly and cause the browser to fail to decode.
      // https://stackoverflow.com/questions/43065553/base64-decoded-differently-in-java-jjwt
      return JSON.parse(atob(separated[1].replace(/-/g, '+').replace(/_/g, '/')));
    } catch (error) {
      return null;
    }
  }
}

export declare namespace IDToken {
  export interface UserInfo {
    [key: string]: any;

    /**
     * Issuer Identifier for the Issuer of the response.
     */
    iss: string;

    /**
     * A locally unique and never reassigned identifier within the Provider for the End-User.
     */
    sub: string;

    /**
     * Audience(s) that this ID Token is intended for.
     */
    aud: string[];

    /**
     * Value used to mitigate replay attacks by associating a client session with an id_token.
     */
    nonce: string;

    /**
     * Expiration time on or after which the ID Token MUST NOT be accepted for processing.
     *
     * Represented as a unix epoch timestamp (seconds)
     */
    exp: number;

    /**
     * When the JWT was issued.
     *
     * Represented as a unix epoch timestamp (seconds)
     */
    iat: number;
  }
}

