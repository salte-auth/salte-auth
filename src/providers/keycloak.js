/**
 * Provider for Keycloak.
 * Keycloak is an open source identity and access management solution.
 * @see https://www.keycloak.org/
 */
class SalteAuthKeycloakProvider {
  /**
   * Computes the authorization endpoint
   * @param {Config} config configuration for salte auth
   * @return {String} the authorization endpoint
   */
  static authorizeEndpoint(config) {
    return `${config.providerUrl}/protocol/openid-connect/auth`;
  }

  /**
   * Computes the deauthorization url
   * @param {Config} config configuration for salte auth
   * @return {String} the deauthorization url
   */
  static deauthorizeUrl(config) {
    return this.$utilities.createUrl(`${config.providerUrl}/protocol/openid-connect/logout`, {
      redirect_uri: config.redirectUrl && config.redirectUrl.logoutUrl || config.redirectUrl,
      client_id: config.clientId
    });
  }
}

export default SalteAuthKeycloakProvider;
