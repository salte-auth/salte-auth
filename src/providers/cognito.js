class SalteAuthCognitoProvider {
  static deauthorizeUrl(config) {
    const gateway = config.gateway.replace('/oauth2', '');
    return this.utilities.createUrl(`${gateway}/logout`, {
      'logout_uri': config.redirectUrl,
      'client_id': config.clientId
    });
  }
}

export default SalteAuthCognitoProvider;
