class SalteAuthAuth0Provider {
  static deauthorizeUrl(config) {
    return this.utilities.createUrl(`${config.gateway}/v2/logout`, {
      'returnTo': config.redirectUrl,
      'client_id': config.clientId
    });
  }
}

export default SalteAuthAuth0Provider;
