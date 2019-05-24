export class SalteAuthError extends Error {
  public code: string;

  public constructor({ message, code }: SalteAuthError.Options) {
    super(message);

    this.code = code;
  }
}

export declare namespace SalteAuthError {
  export interface Options {
    message: string;
    code: string;
  }
}
