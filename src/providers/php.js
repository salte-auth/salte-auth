/**
 * Provider for PHP OAuth 2.0 Server
 * A spec compliant, secure by default PHP OAuth 2.0 Server
 * @see https://oauth2.thephpleague.com
 */
class SalteAuthPhpProvider {
  /**
   * Computes the authorization endpoint
   * @param {Config} config configuration for salte auth
   * @return {String} the authorization endpoint
   */
  static authorizeEndpoint(config) {
    return `${config.providerUrl}/implicit.php/authorize`;
  }

  /**
   * Computes the deauthorization url
   * @param {Config} config configuration for salte auth
   * @return {String} the deauthorization url
   */
  static deauthorizeUrl(config) {
    return this.$utilities.createUrl(`${config.providerUrl}/implicit.php/logout`, {
      returnTo: config.redirectUrl && config.redirectUrl.logoutUrl || config.redirectUrl,
      client_id: config.clientId
    });
  }
}

export default SalteAuthPhpProvider;
