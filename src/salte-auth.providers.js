import auth0 from './providers/auth0.js';
import cognito from './providers/cognito.js';
import wso2 from './providers/wso2.js';

/**
 * A collection of available providers
 */
const providers = {
  auth0,
  cognito,
  wso2
};

export default providers;
