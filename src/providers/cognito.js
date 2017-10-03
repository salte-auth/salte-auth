/** Provider for Amazon's Cognito */
class SalteAuthCognitoProvider {
  /**
   * Computes the authorization url
   * @param {Config} config configuration for salte auth
   * @return {String} the deauthorization url
   */
  static authorizeUrl(config) {
    return `${config.gateway}/oauth2/authorize`;
  }

  /**
   * Computes the deauthorization url
   * @param {Config} config configuration for salte auth
   * @return {String} the deauthorization url
   */
  static deauthorizeUrl(config) {
    return this.utilities.createUrl(`${config.gateway}/logout`, {
      'logout_uri': config.redirectUrl,
      'client_id': config.clientId
    });
  }

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
