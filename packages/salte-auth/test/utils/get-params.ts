export function getParams(url) {
  const [, params] = url.split('?');

  return params.split('&').reduce((output, param) => {
    const [key, value] = param.split('=');

    output[key] = value;

    return output;
  }, {});
}
