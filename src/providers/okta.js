/** Provider for Okta */
class SalteAuthOktaProvider {
  /**
   * Computes the authorization endpoint
   * @param {Config} config configuration for salte auth
   * @return {String} the authorization endpoint
   */
  static authorizeEndpoint(config) {
    return `${config.providerUrl}/oauth2/v1/authorize`;
  }

  /**
   * Computes the deauthorization url
   * @param {Config} config configuration for salte auth
   * @return {String} the deauthorization url
   */
  static deauthorizeUrl(config) {
    return this.$utilities.createUrl(`${config.providerUrl}/oauth2/v1/logout`, {
      id_token_hint: config.idToken,
      post_logout_redirect_uri: config.redirectUrl && config.redirectUrl.logoutUrl || config.redirectUrl
    });
  }
}

export default SalteAuthOktaProvider;
