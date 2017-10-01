class SalteAuthCognitoProvider {
  static authorizeUrl(config) {
    return `${config.gateway}/oauth2/authorize`;
  }

  static deauthorizeUrl(config) {
    return this.utilities.createUrl(`${config.gateway}/logout`, {
      'logout_uri': config.redirectUrl,
      'client_id': config.clientId
    });
  }
}

export default SalteAuthCognitoProvider;
