/**
 * salte-auth JavaScript Library v1.0.12
 *
 * @license MIT (https://github.com/salte-io/salte-auth/blob/master/LICENSE)
 *
 * Made with ♥ by Ceci <admin@cecilias.me>, Dave Woodward <dave@salte.io>
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("salte-auth",[],t):"object"==typeof exports?exports["salte-auth"]=t():e["salte-auth"]=t()}(this,function(){return function(e){function t(n){if(i[n])return i[n].exports;var s=i[n]={exports:{},id:n,loaded:!1};return e[n].call(s.exports,s,s.exports,t),s.loaded=!0,s.exports}var i={};return t.m=e,t.c=i,t.p="",t(0)}([function(e,t,i){(function(e){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),a=i(3),h=n(a),u=function(){function e(t){if(s(this,e),this.REQUEST_TYPE={LOGIN:"LOGIN",RENEW_TOKEN:"RENEW_TOKEN",UNKNOWN:"UNKNOWN"},this.CONSTANTS={ACCESS_TOKEN:"access_token",EXPIRES_IN:"expires_in",ID_TOKEN:"id_token",ERROR_DESCRIPTION:"error_description",SESSION_STATE:"session_state",STORAGE:{TOKEN_KEYS:"auth.token.keys",ACCESS_TOKEN_KEY:"auth.access.token.key",EXPIRATION_KEY:"auth.expiration.key",STATE_LOGIN:"auth.state.login",STATE_RENEW:"auth.state.renew",NONCE_IDTOKEN:"auth.nonce.idtoken",SESSION_STATE:"auth.session.state",USERNAME:"auth.username",IDTOKEN:"auth.idtoken",ERROR:"auth.error",ERROR_DESCRIPTION:"auth.error.description",LOGIN_REQUEST:"auth.login.request",LOGIN_ERROR:"auth.login.error",RENEW_STATUS:"auth.token.renew.status"},RESOURCE_DELIMETER:"|",LOADFRAME_TIMEOUT:"6000",TOKEN_RENEW_STATUS_CANCELED:"Canceled",TOKEN_RENEW_STATUS_COMPLETED:"Completed",TOKEN_RENEW_STATUS_IN_PROGRESS:"In Progress",LOGGING_LEVEL:{ERROR:0,WARN:1,INFO:2,VERBOSE:3},LEVEL_STRING_MAP:{0:"ERROR:",1:"WARNING:",2:"INFO:",3:"VERBOSE:"},POPUP_WIDTH:483,POPUP_HEIGHT:600},window.AuthenticationContext)return window.AuthenticationContext;if(window.AuthenticationContext=this,this.config={},this.callback=null,this.popUp=!1,this.isAngular=!1,this._user=null,this._activeRenewals={},this._loginInProgress=!1,this._renewStates=[],this.callBackMappedToRenewStates={},this.callBacksMappedToRenewStates={},t.displayCall&&"function"!=typeof t.displayCall)throw new Error("displayCall is not a function");if(!t.clientId)throw new Error("clientId is required");if(this.config=this._cloneConfig(t),this.config.popUp&&(this.popUp=!0),this.config.callback&&"function"==typeof this.config.callback&&(this.callback=this.config.callback),!this.config.url||!this.config.url.match(/^https:\/\/.*\/$/))throw new Error("url must be a valid https endpoint that ends in a forward slash.");this.config.loginResource||(this.config.loginResource=this.config.clientId),this.config.redirectUri||(this.config.redirectUri=window.location.href),this.config.anonymousEndpoints||(this.config.anonymousEndpoints=[]),this.config.isAngular&&(this.isAngular=this.config.isAngular),this.setResponseType(this.config.responseType)}return r(e,[{key:"setResponseType",value:function(e){this.config.responseType=e||this.CONSTANTS.ID_TOKEN}},{key:"login",value:function(e){if(this._loginInProgress)return void this.info("Login in progress");var t=h["default"].v4();this.config.state=t,this._idTokenNonce=h["default"].v4(),e||(e=window.location),this.verbose("Expected state: "+t+" startPage:"+e),this._saveItem(this.CONSTANTS.STORAGE.LOGIN_REQUEST,e),this._saveItem(this.CONSTANTS.STORAGE.LOGIN_ERROR,""),this._saveItem(this.CONSTANTS.STORAGE.STATE_LOGIN,t),this._saveItem(this.CONSTANTS.STORAGE.NONCE_IDTOKEN,this._idTokenNonce),this._saveItem(this.CONSTANTS.STORAGE.ERROR,""),this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION,"");var i=this._getNavigateUrl(this.config.responseType,null)+"&nonce="+encodeURIComponent(this._idTokenNonce);return this._loginInProgress=!0,this.popUp?void this._loginPopup(i):void(this.config.displayCall?this.config.displayCall(i):this.promptUser(i))}},{key:"_openPopup",value:function(e,t,i,n){try{var s=window.screenLeft?window.screenLeft:window.screenX,o=window.screenTop?window.screenTop:window.screenY,r=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,a=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight,h=r/2-i/2+s,u=a/2-n/2+o,T=this.open(e,t,"width="+i+", height="+n+", top="+u+", left="+h);return T.focus&&T.focus(),T}catch(c){return this.warn("Error opening popup, "+c.message),this._loginInProgress=!1,null}}},{key:"_loginPopup",value:function(e){var t=this,i=this._openPopup(e,"login",this.CONSTANTS.POPUP_WIDTH,this.CONSTANTS.POPUP_HEIGHT);if(null===i)return this.warn("Popup Window is null. This can happen if you are using IE"),this._saveItem(this.CONSTANTS.STORAGE.ERROR,"Error opening popup"),this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION,"Popup Window is null. This can happen if you are using IE"),this._saveItem(this.CONSTANTS.STORAGE.LOGIN_ERROR,"Popup Window is null. This can happen if you are using IE"),void(this.callback&&this.callback(this._getItem(this.CONSTANTS.STORAGE.LOGIN_ERROR),null));var n=void 0;n=this.config.redirectUri.indexOf("#")===-1?this.config.redirectUri:this.config.redirectUri.split("#")[0];var s=window.setInterval(function(){i&&!i.closed&&void 0!==i.closed||(t._loginInProgress=!1,window.clearInterval(s));try{i.location.href.indexOf(n)!==-1&&(t.isAngular?window.location.hash=i.location.hash:t.handleWindowCallback(i.location.hash,i.location.search),window.clearInterval(s),t._loginInProgress=!1,t.info("Closing popup window"),i.close())}catch(e){}},20)}},{key:"loginInProgress",value:function(){return this._loginInProgress}},{key:"_hasResource",value:function(e){var t=this._getItem(this.CONSTANTS.STORAGE.TOKEN_KEYS);return t&&!this._isEmpty(t)&&t.indexOf(e+this.CONSTANTS.RESOURCE_DELIMETER)>-1}},{key:"getCachedToken",value:function(e){if(!this._hasResource(e))return null;var t=this._getItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY+e),i=this._getItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY+e),n=this.config.expireOffsetSeconds||120;return i&&i>this._now()+n?t:(this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY+e,""),this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY+e,0),null)}},{key:"getCachedUser",value:function(){if(this._user)return this._user;var e=this._getItem(this.CONSTANTS.STORAGE.IDTOKEN);return this._user=this._createUser(e),this._user}},{key:"registerCallback",value:function(e,t,i){var n=this;this._activeRenewals[t]=e,this.callBacksMappedToRenewStates[e]||(this.callBacksMappedToRenewStates[e]=[]),this.callBacksMappedToRenewStates[e].push(i),this.callBackMappedToRenewStates[e]||(this.callBackMappedToRenewStates[e]=function(i,s){for(var o=0;o<n.callBacksMappedToRenewStates[e].length;++o)try{n.callBacksMappedToRenewStates[e][o](i,s)}catch(r){n.warn(r)}n._activeRenewals[t]=null,n.callBacksMappedToRenewStates[e]=null,n.callBackMappedToRenewStates[e]=null})}},{key:"_renewToken",value:function(e,t){this.info("renewToken is called for resource:"+e);var i=this._addAuthFrame("authRenewFrame"+e),n=h["default"].v4()+"|"+e;this.config.state=n,this._renewStates.push(n),this.verbose("Renew token Expected state: "+n);var s=this._getNavigateUrl("token",e)+"&prompt=none";s=this._addHintParameters(s),this.registerCallback(n,e,t),this.verbose("Navigate to:"+s),this._saveItem(this.CONSTANTS.STORAGE.LOGIN_REQUEST,""),i.src="about:blank",this._loadFrameTimeout(s,"authRenewFrame"+e,e)}},{key:"_renewIdToken",value:function(e){this.info("renewIdToken is called");var t=this._addAuthFrame("authIdTokenFrame"),i=h["default"].v4()+"|"+this.config.clientId;this._idTokenNonce=h["default"].v4(),this._saveItem(this.CONSTANTS.STORAGE.NONCE_IDTOKEN,this._idTokenNonce),this.config.state=i,this._renewStates.push(i),this.verbose("Renew Idtoken Expected state: "+i);var n=this._getNavigateUrl(this.config.responseType,null)+"&prompt=none";n=this._addHintParameters(n),n+="&nonce="+encodeURIComponent(this._idTokenNonce),this.registerCallback(i,this.config.clientId,e),this.idTokenNonce=null,this.verbose("Navigate to:"+n),this._saveItem(this.CONSTANTS.STORAGE.LOGIN_REQUEST,""),t.src="about:blank",this._loadFrameTimeout(n,"authIdTokenFrame",this.config.clientId)}},{key:"_urlContainsQueryStringParameter",value:function(e,t){var i=new RegExp("[\\?&]"+e+"=");return i.test(t)}},{key:"_loadFrameTimeout",value:function(e,t,i){var n=this;this.verbose("Set loading state to pending for: "+i),this._saveItem(this.CONSTANTS.STORAGE.RENEW_STATUS+i,this.CONSTANTS.TOKEN_RENEW_STATUS_IN_PROGRESS),this._loadFrame(e,t),setTimeout(function(){if(n._getItem(n.CONSTANTS.STORAGE.RENEW_STATUS+i)===n.CONSTANTS.TOKEN_RENEW_STATUS_IN_PROGRESS){n.verbose("Loading frame has timed out after: "+n.CONSTANTS.LOADFRAME_TIMEOUT/1e3+" seconds for resource "+i);var e=n._activeRenewals[i];n._saveItem(n.CONSTANTS.STORAGE.RENEW_STATUS+i,n.CONSTANTS.TOKEN_RENEW_STATUS_CANCELED),e&&n.callBackMappedToRenewStates[e]&&n.callBackMappedToRenewStates[e]("Token renewal operation failed due to timeout",null)}},this.CONSTANTS.LOADFRAME_TIMEOUT)}},{key:"_loadFrame",value:function(e,t){var i=this;this.info("LoadFrame: "+t);var n=t;setTimeout(function(){var t=i._addAuthFrame(n);""!==t.src&&"about:blank"!==t.src||(t.src=e,i._loadFrame(e,n))},500)}},{key:"acquireToken",value:function(e,t){if(this._isEmpty(e))return this.warn("resource is required"),void t("resource is required",null);var i=this.getCachedToken(e);return i?(this.info("Token is already in cache for resource:"+e),void t(null,i)):this._user?void(this._activeRenewals[e]?this.registerCallback(this._activeRenewals[e],e,t):e===this.config.clientId?(this.verbose("renewing idtoken"),this._renewIdToken(t)):this._renewToken(e,t)):(this.warn("User login is required"),void t("User login is required",null))}},{key:"promptUser",value:function(e){e?(this.info("Navigate to:"+e),this.navigate(e)):this.info("Navigate url is empty")}},{key:"clearCache",value:function(){this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY,""),this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY,0),this._saveItem(this.CONSTANTS.STORAGE.SESSION_STATE,""),this._saveItem(this.CONSTANTS.STORAGE.STATE_LOGIN,""),this._renewStates=[],this._saveItem(this.CONSTANTS.STORAGE.USERNAME,""),this._saveItem(this.CONSTANTS.STORAGE.IDTOKEN,""),this._saveItem(this.CONSTANTS.STORAGE.ERROR,""),this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION,"");var e=this._getItem(this.CONSTANTS.STORAGE.TOKEN_KEYS);if(!this._isEmpty(e)){e=e.split(this.CONSTANTS.RESOURCE_DELIMETER);for(var t=0;t<e.length;t++)this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY+e[t],""),this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY+e[t],0)}this._saveItem(this.CONSTANTS.STORAGE.TOKEN_KEYS,"")}},{key:"clearCacheForResource",value:function(e){this._saveItem(this.CONSTANTS.STORAGE.STATE_RENEW,""),this._saveItem(this.CONSTANTS.STORAGE.ERROR,""),this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION,""),this._hasResource(e)&&(this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY+e,""),this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY+e,0))}},{key:"logOut",value:function(){this.clearCache();var e="";this._user=null,this.config.postLogoutRedirectUri&&(e="post_logout_redirect_uri="+encodeURIComponent(this.config.postLogoutRedirectUri));var t=this.config.url+"logout?"+e;this.info("Logout navigate to: "+t),this.promptUser(t)}},{key:"_isEmpty",value:function(e){return"undefined"==typeof e||!e||0===e.length}},{key:"getUser",value:function(e){if("function"!=typeof e)throw new Error("callback is not a function");if(this._user)return void e(null,this._user);var t=this._getItem(this.CONSTANTS.STORAGE.IDTOKEN);this._isEmpty(t)?(this.warn("User information is not available"),e("User information is not available")):(this.info("User exists in cache: "),this._user=this._createUser(t),e(null,this._user))}},{key:"_addHintParameters",value:function(e){if(this._user&&this._user.profile&&this._user.profile.hasOwnProperty("upn")&&(e+="&login_hint="+encodeURIComponent(this._user.profile.upn),!this._urlContainsQueryStringParameter("domain_hint",e)&&this._user.profile.upn.indexOf("@")>-1)){var t=this._user.profile.upn.split("@");e+="&domain_hint="+encodeURIComponent(t[t.length-1])}return e}},{key:"_createUser",value:function(e){var t=null,i=this._extractIdToken(e);if(i&&i.hasOwnProperty("aud")){var n=!1;if(Array.isArray(i.aud)){if(i.hasOwnProperty("azp")&&i.azp.toLowerCase()===this.config.clientId.toLowerCase())for(var s=0;s<i.aud.length;s++)if(i.aud[s].toLowerCase()===this.config.clientId.toLowerCase()){n=!0;break}}else n=i.aud.toLowerCase()===this.config.clientId.toLowerCase();n?(t={userName:"",profile:i},i.hasOwnProperty("upn")?t.userName=i.upn:i.hasOwnProperty("email")?t.userName=i.email:i.hasOwnProperty("sub")&&(t.userName=i.sub)):this.warn("IdToken has invalid aud/azp field")}return t}},{key:"_getHash",value:function(e){return e.indexOf("#/")>-1?e=e.substring(e.indexOf("#/")+2):e.indexOf("#")>-1&&(e=e.substring(1)),e}},{key:"_getSearch",value:function(e){return e.indexOf("?")>-1&&(e=e.substring(1)),e}},{key:"_getParameters",value:function(e,t){var i={};if(e&&(e=this._getHash(e),i=this._deserialize(e)),t){t=this._getSearch(t);var n=this._deserialize(t);i=this._extend(i,n)}return i}},{key:"_extend",value:function(e,t){for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i]);return e}},{key:"isCallback",value:function(e,t){var i=this._getParameters(e,t);return i.hasOwnProperty(this.CONSTANTS.ERROR_DESCRIPTION)||i.hasOwnProperty(this.CONSTANTS.ACCESS_TOKEN)||i.hasOwnProperty(this.CONSTANTS.ID_TOKEN)}},{key:"getLoginError",value:function(){return this._getItem(this.CONSTANTS.STORAGE.LOGIN_ERROR)}},{key:"getRequestInfo",value:function(e,t){var i=this._getParameters(e,t),n={valid:!1,parameters:{},stateMatch:!1,stateResponse:"",requestType:this.REQUEST_TYPE.UNKNOWN};if(i&&(n.parameters=i,i.hasOwnProperty(this.CONSTANTS.ERROR_DESCRIPTION)||i.hasOwnProperty(this.CONSTANTS.ACCESS_TOKEN)||i.hasOwnProperty(this.CONSTANTS.ID_TOKEN))){n.valid=!0;var s="";if(!i.hasOwnProperty("state"))return this.warn("No state returned"),n;if(this.verbose("State: "+i.state),s=i.state,n.stateResponse=s,s===this._getItem(this.CONSTANTS.STORAGE.STATE_LOGIN))return n.requestType=this.REQUEST_TYPE.LOGIN,n.stateMatch=!0,n;if(!n.stateMatch&&window.parent&&window.parent.AuthenticationContext)for(var o=window.parent.AuthenticationContext._renewStates,r=0;r<o.length;r++)if(o[r]===n.stateResponse){n.requestType=this.REQUEST_TYPE.RENEW_TOKEN,n.stateMatch=!0;break}}return n}},{key:"_getResourceFromState",value:function(e){if(e){var t=e.indexOf("|");if(t>-1&&t+1<e.length)return e.substring(t+1)}return""}},{key:"saveTokenFromHash",value:function(e){this.info("State status:"+e.stateMatch+"; Request type:"+e.requestType),this._saveItem(this.CONSTANTS.STORAGE.ERROR,""),this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION,"");var t=this._getResourceFromState(e.stateResponse);if(e.parameters.hasOwnProperty(this.CONSTANTS.ERROR_DESCRIPTION))this.info("Error :"+e.parameters.error+"; Error description:"+e.parameters[this.CONSTANTS.ERROR_DESCRIPTION]),this._saveItem(this.CONSTANTS.STORAGE.ERROR,e.parameters.error),this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION,e.parameters[this.CONSTANTS.ERROR_DESCRIPTION]),e.requestType===this.REQUEST_TYPE.LOGIN&&(this._loginInProgress=!1,this._saveItem(this.CONSTANTS.STORAGE.LOGIN_ERROR,e.parameters.error_description));else if(e.stateMatch){this.info("State is right"),e.parameters.hasOwnProperty(this.CONSTANTS.SESSION_STATE)&&this._saveItem(this.CONSTANTS.STORAGE.SESSION_STATE,e.parameters[this.CONSTANTS.SESSION_STATE]);var i=void 0;e.parameters.hasOwnProperty(this.CONSTANTS.ACCESS_TOKEN)&&(this.info("Fragment has access token"),this._hasResource(t)||(i=this._getItem(this.CONSTANTS.STORAGE.TOKEN_KEYS)||"",this._saveItem(this.CONSTANTS.STORAGE.TOKEN_KEYS,i+t+this.CONSTANTS.RESOURCE_DELIMETER)),this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY+t,e.parameters[this.CONSTANTS.ACCESS_TOKEN]),this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY+t,this._expiresIn(e.parameters[this.CONSTANTS.EXPIRES_IN]))),e.parameters.hasOwnProperty(this.CONSTANTS.ID_TOKEN)&&(this.info("Fragment has id token"),this._loginInProgress=!1,this._user=this._createUser(e.parameters[this.CONSTANTS.ID_TOKEN]),this._user&&this._user.profile?this._user.profile.nonce===this._getItem(this.CONSTANTS.STORAGE.NONCE_IDTOKEN)?(this._saveItem(this.CONSTANTS.STORAGE.IDTOKEN,e.parameters[this.CONSTANTS.ID_TOKEN]),t=this.config.loginResource?this.config.loginResource:this.config.clientId,this._hasResource(t)||(i=this._getItem(this.CONSTANTS.STORAGE.TOKEN_KEYS)||"",this._saveItem(this.CONSTANTS.STORAGE.TOKEN_KEYS,i+t+this.CONSTANTS.RESOURCE_DELIMETER)),this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY+t,e.parameters[this.CONSTANTS.ID_TOKEN]),this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY+t,this._user.profile.exp)):(this._user=null,this._saveItem(this.CONSTANTS.STORAGE.LOGIN_ERROR,"Nonce is not same as "+this._idTokenNonce)):(this._saveItem(this.CONSTANTS.STORAGE.ERROR,"invalid id_token"),this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION,"Invalid id_token. id_token: "+e.parameters[this.CONSTANTS.ID_TOKEN])))}else this._saveItem(this.CONSTANTS.STORAGE.ERROR,"Invalid_state"),this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION,"Invalid_state. state: "+e.stateResponse);this._saveItem(this.CONSTANTS.STORAGE.RENEW_STATUS+t,this.CONSTANTS.TOKEN_RENEW_STATUS_COMPLETED)}},{key:"getResourceForEndpoint",value:function(e){if(this.config&&this.config.securedEndpoints)for(var t in this.config.securedEndpoints)if(e.indexOf(t)>-1)return this.config.securedEndpoints[t];if(!(e.indexOf("http://")>-1||e.indexOf("https://")>-1)){if(this.config&&this.config.anonymousEndpoints)for(var i=0;i<this.config.anonymousEndpoints.length;i++)if(e.indexOf(this.config.anonymousEndpoints[i])>-1)return null;return this.config.loginResource}return this._getHostFromUri(e)===this._getHostFromUri(this.config.redirectUri)?this.config.loginResource:null}},{key:"_getHostFromUri",value:function(e){var t=String(e).replace(/^(https?:)\/\//,"");return t=t.split("/")[0]}},{key:"handleWindowCallback",value:function(e,t){if(e||(e=window.location.hash),t||(t=window.location.search),this.isCallback(e,t)){var i=this.getRequestInfo(e,t);this.info("Returned from redirect url"),this.saveTokenFromHash(i);var n=null;if(i.requestType===this.REQUEST_TYPE.RENEW_TOKEN&&this.isIframe())return this.verbose("Window is in iframe"),n=window.parent.AuthenticationContext.callBackMappedToRenewStates[i.stateResponse],void(n&&n(this._getItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION),i.parameters[this.CONSTANTS.ACCESS_TOKEN]||i.parameters[this.CONSTANTS.ID_TOKEN]));i.requestType===this.REQUEST_TYPE.LOGIN&&(n=this.callback,n&&n(this._getItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION),i.parameters[this.CONSTANTS.ID_TOKEN])),this.popUp||this.navigate(this._getItem(this.CONSTANTS.STORAGE.LOGIN_REQUEST))}}},{key:"_getNavigateUrl",value:function(e,t){var i=this.config.url+"authorize"+this._serialize(e,this.config,t)+this._addLibMetadata();return this.config.scope&&(i+="&scope="+encodeURIComponent(this.config.scope)),this.info("Navigate url:"+i),i}},{key:"_extractIdToken",value:function(e){var t=this._decodeJwt(e);if(!t)return null;try{var i=t.JWSPayload,n=this._base64DecodeStringUrlSafe(i);return n?JSON.parse(n):(this.info("The returned id_token could not be base64 url safe decoded."),null)}catch(s){this.error("The returned id_token could not be decoded",s)}return null}},{key:"_base64DecodeStringUrlSafe",value:function(e){return e=e.replace(/-/g,"+").replace(/_/g,"/"),decodeURIComponent(escape(window.atob(e)))}},{key:"_decodeJwt",value:function(e){if(this._isEmpty(e))return null;var t=/^([^\.\s]*)\.([^\.\s]+)\.([^\.\s]*)$/,i=t.exec(e);if(!i||i.length<4)return this.warn("The returned id_token is not parseable."),null;var n={header:i[1],JWSPayload:i[2],JWSSig:i[3]};return n}},{key:"_convertUrlSafeToRegularBase64EncodedString",value:function(e){return e.replace("-","+").replace("_","/")}},{key:"_serialize",value:function(e,t,i){var n=[];if(null!==t){n.push("?response_type="+encodeURIComponent(e)),n.push("client_id="+encodeURIComponent(t.clientId)),i&&n.push("resource="+encodeURIComponent(i)),n.push("redirect_uri="+encodeURIComponent(t.redirectUri)),n.push("state="+encodeURIComponent(t.state)),t.hasOwnProperty("slice")&&n.push("slice="+encodeURIComponent(t.slice)),t.hasOwnProperty("extraQueryParameter")&&n.push(t.extraQueryParameter);var s=t.correlationId?t.correlationId:h["default"].v4();n.push("client-request-id="+encodeURIComponent(s))}return n.join("&")}},{key:"_deserialize",value:function(e){for(var t=/\+/g,i=/([^&=]+)=([^&]*)/g,n=function(e){return decodeURIComponent(e.replace(t," "))},s={},o=i.exec(e);o;)s[n(o[1])]=n(o[2]),o=i.exec(e);return s}},{key:"_decimalToHex",value:function(e){for(var t=e.toString(16);t.length<2;)t="0"+t;return t}},{key:"_expiresIn",value:function(e){return this._now()+parseInt(e,10)}},{key:"_now",value:function(){return Math.round((new Date).getTime()/1e3)}},{key:"_addAuthFrame",value:function(e){if("undefined"!=typeof e){this.info("Add auth frame to document:"+e);var t=document.getElementById(e);if(!t){if(document.createElement&&document.documentElement&&(window.opera||window.navigator.userAgent.indexOf("MSIE 5.0")===-1)){var i=document.createElement("iframe");i.setAttribute("id",e),i.style.visibility="hidden",i.style.position="absolute",i.style.width=i.style.height=i.borderWidth="0px",t=document.getElementsByTagName("body")[0].appendChild(i)}else document.body&&document.body.insertAdjacentHTML&&document.body.insertAdjacentHTML("beforeEnd",'<iframe name="'+e+'" id="'+e+'" style="display:none"></iframe>');window.frames&&window.frames[e]&&(t=window.frames[e])}return t}}},{key:"_saveItem",value:function(e,t){return this.config&&this.config.cacheLocation&&"localStorage"===this.config.cacheLocation?this._supportsLocalStorage()?(localStorage.setItem(e,t),!0):(this.info("Local storage is not supported"),!1):this._supportsSessionStorage()?(sessionStorage.setItem(e,t),!0):(this.info("Session storage is not supported"),!1)}},{key:"_getItem",value:function(e){return this.config&&this.config.cacheLocation&&"localStorage"===this.config.cacheLocation?this._supportsLocalStorage()?localStorage.getItem(e):(this.info("Local storage is not supported"),null):this._supportsSessionStorage()?sessionStorage.getItem(e):(this.info("Session storage is not supported"),null)}},{key:"_supportsLocalStorage",value:function(){try{return"localStorage"in window&&window.localStorage}catch(e){return!1}}},{key:"_supportsSessionStorage",value:function(){try{return"sessionStorage"in window&&window.sessionStorage}catch(e){return!1}}},{key:"_cloneConfig",value:function(e){if(null===e||"object"!==("undefined"==typeof e?"undefined":o(e)))return e;var t={};for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);return t}},{key:"_addLibMetadata",value:function(){return"&x-client-SKU=Js&x-client-Ver="+this._libVersion()}},{key:"log",value:function(e,t,i){if(e<=Logging.level){var n=(new Date).toUTCString(),s="";s=this.config.correlationId?n+":"+this.config.correlationId+"-"+this._libVersion()+"-"+this.CONSTANTS.LEVEL_STRING_MAP[e]+" "+t:n+":"+this._libVersion()+"-"+this.CONSTANTS.LEVEL_STRING_MAP[e]+" "+t,i&&(s+="\nstack:\n"+i.stack),Logging.log(s)}}},{key:"error",value:function(e,t){this.log(this.CONSTANTS.LOGGING_LEVEL.ERROR,e,t)}},{key:"warn",value:function(e){this.log(this.CONSTANTS.LOGGING_LEVEL.WARN,e,null)}},{key:"info",value:function(e){this.log(this.CONSTANTS.LOGGING_LEVEL.INFO,e,null)}},{key:"verbose",value:function(e){this.log(this.CONSTANTS.LOGGING_LEVEL.VERBOSE,e,null)}},{key:"navigate",value:function(e){window.location.replace(e)}},{key:"isIframe",value:function(){return window.parent&&window.parent!==window}},{key:"open",value:function(e,t,i){return window.open(e,t,i)}},{key:"_libVersion",value:function(){return"1.0.12"}}]),e}();t["default"]=u,e.Logging={level:0,log:function(e){}}}).call(t,function(){return this}())},function(e,t){function i(e,t){var i=t||0,s=n;return s[e[i++]]+s[e[i++]]+s[e[i++]]+s[e[i++]]+"-"+s[e[i++]]+s[e[i++]]+"-"+s[e[i++]]+s[e[i++]]+"-"+s[e[i++]]+s[e[i++]]+"-"+s[e[i++]]+s[e[i++]]+s[e[i++]]+s[e[i++]]+s[e[i++]]+s[e[i++]]}for(var n=[],s=0;s<256;++s)n[s]=(s+256).toString(16).substr(1);e.exports=i},function(e,t){(function(t){var i,n=t.crypto||t.msCrypto;if(n&&n.getRandomValues){var s=new Uint8Array(16);i=function(){return n.getRandomValues(s),s}}if(!i){var o=new Array(16);i=function(){for(var e,t=0;t<16;t++)0===(3&t)&&(e=4294967296*Math.random()),o[t]=e>>>((3&t)<<3)&255;return o}}e.exports=i}).call(t,function(){return this}())},function(e,t,i){var n=i(4),s=i(5),o=s;o.v1=n,o.v4=s,e.exports=o},function(e,t,i){function n(e,t,i){var n=t&&i||0,s=t||[];e=e||{};var r=void 0!==e.clockseq?e.clockseq:h,c=void 0!==e.msecs?e.msecs:(new Date).getTime(),l=void 0!==e.nsecs?e.nsecs:T+1,S=c-u+(l-T)/1e4;if(S<0&&void 0===e.clockseq&&(r=r+1&16383),(S<0||c>u)&&void 0===e.nsecs&&(l=0),l>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");u=c,T=l,h=r,c+=122192928e5;var E=(1e4*(268435455&c)+l)%4294967296;s[n++]=E>>>24&255,s[n++]=E>>>16&255,s[n++]=E>>>8&255,s[n++]=255&E;var N=c/4294967296*1e4&268435455;s[n++]=N>>>8&255,s[n++]=255&N,s[n++]=N>>>24&15|16,s[n++]=N>>>16&255,s[n++]=r>>>8|128,s[n++]=255&r;for(var O=e.node||a,_=0;_<6;++_)s[n+_]=O[_];return t?t:o(s)}var s=i(2),o=i(1),r=s(),a=[1|r[0],r[1],r[2],r[3],r[4],r[5]],h=16383&(r[6]<<8|r[7]),u=0,T=0;e.exports=n},function(e,t,i){function n(e,t,i){var n=t&&i||0;"string"==typeof e&&(t="binary"==e?new Array(16):null,e=null),e=e||{};var r=e.random||(e.rng||s)();if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,t)for(var a=0;a<16;++a)t[n+a]=r[a];return t||o(r)}var s=i(2),o=i(1);e.exports=n}])});
//# sourceMappingURL=salte-auth.js.map