export async function ignoreError(promise: Promise<any>) {
  try {
    return await promise;
  } catch (error) {
    return error;
  }
}
