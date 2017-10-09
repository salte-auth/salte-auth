/** Provider for Azure's Active Directory */
class SalteAuthAzureProvider {
  /**
   * Computes the authorization endpoint
   * @param {Config} config configuration for salte auth
   * @return {String} the authorization endpoint
   */
  static authorizeEndpoint(config) {
    return `${config.gateway}/oauth2/authorize`;
  }

  /**
   * Computes the deauthorization url
   * @param {Config} config configuration for salte auth
   * @return {String} the deauthorization url
   */
  static deauthorizeUrl(config) {
    return this.utilities.createUrl(`${config.gateway}/oauth2/logout`, {
      'post_logout_redirect_uri': config.redirectUrl
    });
  }
}

export default SalteAuthAzureProvider;
