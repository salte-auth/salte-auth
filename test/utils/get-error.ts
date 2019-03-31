export function getError(input: Promise<any>): Promise<Error>;
export function getError(input: Function): Error;
export function getError(input: Function | Promise<any>): Error | Promise<Error> {
  if (input instanceof Promise) {
    return input.then(() => null).catch((error) => error);
  }

  try {
    input();
  } catch (error) {
    return error;
  }
}
