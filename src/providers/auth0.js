/**
 * Provider for Auth0
 * @see https://auth0.com
 */
class SalteAuthAuth0Provider {
  /**
   * Computes the deauthorization url
   * @param {Config} config configuration for salte auth
   * @return {String} the deauthorization url
   */
  static deauthorizeUrl(config) {
    return this.$utilities.createUrl(`${config.providerUrl}/v2/logout`, {
      'returnTo': config.redirectUrl,
      'client_id': config.clientId
    });
  }
}

export default SalteAuthAuth0Provider;
