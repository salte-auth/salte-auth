/** Provider for WSO2's API Gateway */
class SalteAuthWSO2Provider {
  /**
   * Computes the deauthorization url
   * @param {Config} config configuration for salte auth
   * @return {String} the deauthorization url
   */
  static deauthorizeUrl(config) {
    return this.$utilities.createUrl(`${config.providerUrl}/commonauth`, {
      commonAuthLogout: true,
      type: 'oidc',
      commonAuthCallerPath: config.redirectUrl && config.redirectUrl.logoutUrl || config.redirectUrl,
      relyingParty: config.relyingParty
    });
  }
}

export default SalteAuthWSO2Provider;
