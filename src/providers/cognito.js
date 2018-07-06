/** Provider for Amazon's Cognito */
class SalteAuthCognitoProvider {
  /**
   * Computes the authorization endpoint
   * @param {Config} config configuration for salte auth
   * @return {String} the authorization endpoint
   */
  static authorizeEndpoint(config) {
    return `${config.providerUrl}/oauth2/authorize`;
  }

  /**
   * Computes the deauthorization url
   * @param {Config} config configuration for salte auth
   * @return {String} the deauthorization url
   */
  static deauthorizeUrl(config) {
    if ('signoutUrl' in config) {
      return this.$utilities.createUrl(`${config.providerUrl}/logout`, {
        logout_uri: config.signoutUrl,
        client_id: config.clientId
      });
    } else {
      return this.$utilities.createUrl(`${config.providerUrl}/logout`, {
        logout_uri: config.redirectUrl,
        client_id: config.clientId
      });
    }
  }

  /**
   * Provides a set of default config options required for cognito
   */
  static get defaultConfig() {
    return {
      validation: {
        // Amazon Cognito doesn't support nonce validation
        nonce: false
      }
    };
  }
}

export default SalteAuthCognitoProvider;
