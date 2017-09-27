class SalteAuthWSO2Provider {
  static deauthorizeUrl(config) {
    return this.utilities.createUrl(`${config.gateway}/commonauth`, {
      'commonAuthLogout': true,
      'type': 'oidc',
      'commonAuthCallerPath': config.redirectUrl,
      'relyingParty': config.relyingParty
    });
  }
}

export default SalteAuthWSO2Provider;
