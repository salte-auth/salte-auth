class SalteAuthError extends Error {
  public code: string;

  constructor({ message, code }: SalteAuthError.Options) {
    super(message);

    this.code = code;
  }
}

declare namespace SalteAuthError {
  interface Options {
    message: string;
    code: string;
  }
}

export { SalteAuthError };
