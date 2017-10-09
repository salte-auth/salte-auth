import auth0 from './providers/auth0.js';
import azure from './providers/azure.js';
import cognito from './providers/cognito.js';
import wso2 from './providers/wso2.js';

/**
 * A collection of overrides for specific Identity Providers
 */
class Providers {
  /**
   * Provider for Auth0
   * @type {SalteAuthAuth0Provider}
   */
  static get auth0() {
    return auth0;
  }

  /**
   * Provider for Azure's Active Directory
   * @type {SalteAuthAzureProvider}
   */
  static get azure() {
    return azure;
  }

  /**
   * Provider for Amazon's Cognito
   * @type {SalteAuthCognitoProvider}
   */
  static get cognito() {
    return cognito;
  }

  /**
   * Provider for WSO2's API Gateway
   * @type {SalteAuthWSO2Provider}
   */
  static get wso2() {
    return wso2;
  }
};

export { Providers };
