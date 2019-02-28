import moment from 'moment';
import '@webcomponents/custom-elements/src/native-shim.js';
import '@webcomponents/custom-elements';
import { LitElement } from 'lit-element';
import SalteAuth from './src/salte-auth.js';

const elements = {
  provider: document.getElementById('provider'),
  loginType: document.getElementById('login-type'),
  redirectUrl: document.getElementById('redirect-url'),
  storageType: document.getElementById('storage-type'),
  secured: document.getElementById('secured'),
  footer: document.getElementById('footer'),
  userInfo: document.getElementById('user-info'),
  expiration: document.getElementById('expiration'),
  login: document.getElementById('login'),
  logout: document.getElementById('logout'),
  navigate: document.getElementById('navigate')
};

const configs = {
  auth0: {
    providerUrl: 'https://salte-alpha.auth0.com',
    responseType: 'id_token token',
    clientId: 'mM6h2LHJikwdbkvdoiyE8kHhL7gcV8Wb'
  },

  azure: {
    providerUrl: 'https://login.microsoftonline.com/3f6df7ce-5830-4280-ae97-8e4016d1c6d0',
    responseType: 'id_token',
    clientId: 'c679f65f-8070-4719-8798-31c6fc256736',

    queryParams: {
      resource: 'https://graph.windows.net/'
    }
  },

  cognito: {
    providerUrl: 'https://salte-auth-demo.auth.us-east-1.amazoncognito.com',
    responseType: 'token',
    clientId: '51jmkg1t5h3ob58a1birdke2hm'
  },

  okta: {
    providerUrl: 'https://dev-960892.oktapreview.com',
    responseType: 'id_token token',
    clientId: '0oajg1bj8hxM1z7pa0h7'
  }
};

const queryParams = Object.assign({
  'provider': localStorage.getItem('salte.demo.provider') || 'auth0',
  'login-type': 'redirect',
  'redirect-url': 'single',
  'storage-type': localStorage.getItem('salte.demo.storage-type') || 'session',
  'secured': 'not-secured'
}, location.search.replace(/^\?/, '').split('&').reduce((r, a) => {
  const match = a.match(/([^=]+)(?:=([^&]+))?/);
  const key = match && match[1] || null;
  const value = match && match[2] || null;
  if (value === 'false') {
    r[key] = false;
  } else if (value === 'true') {
    r[key] = true;
  } else {
    r[key] = value;
  }
  return r;
}, {}));

elements.provider.value = queryParams.provider;
elements.loginType.value = queryParams['login-type'];
elements.redirectUrl.value = queryParams['redirect-url'];
elements.storageType.value = queryParams['storage-type'];
elements.secured.value = queryParams.secured;

function updateParamsOnChange() {
  const url = new URL(location.href);
  const value = this.type === 'checkbox' ? this.checked : this.value;
  if ([undefined, null].includes(value)) {
    url.searchParams.delete(this.name);
  } else {
    url.searchParams.set(this.name, value);
  }
  location = url.toString();
}

function refreshUserInfo(error) {
  if (error) {
    console.error(error);
  }

  const userInfo = auth.profile.userInfo;
  if (userInfo) {
    elements.footer.style.display = '';
    elements.userInfo.innerText = JSON.stringify(userInfo, null, 2);

    if (window.expirationRefresh) {
      clearInterval(window.expirationRefresh);
    }

    window.expirationRefresh = setInterval(window.requestAnimationFrame(() => {
      elements.expiration.innerText = 'Expiration Time: ' + moment.duration(salte.auth.profile.userInfo.exp * 1000 - Date.now()).humanize();
    }), 1000);
  } else {
    elements.footer.style.display = 'none';
  }
}

elements.provider.addEventListener('change', updateParamsOnChange);
elements.loginType.addEventListener('change', updateParamsOnChange);
elements.redirectUrl.addEventListener('change', updateParamsOnChange);
elements.storageType.addEventListener('change', updateParamsOnChange);
elements.secured.addEventListener('change', updateParamsOnChange);

const config = Object.assign(configs[queryParams.provider], {
  redirectUrl: queryParams['redirect-url'] === 'single' ? location.protocol + '//' + location.host : {
    loginUrl: location.protocol + '//' + location.host,
    logoutUrl: location.protocol + '//' + location.host
  },

  scope: 'openid',

  provider: queryParams.provider,

  loginType: 'redirect',

  storageType: queryParams['storage-type']
});

if (['all', 'all-routes'].includes(queryParams.secured)) {
  config = Object.assign(config, {
    routes: true
  });
}

if (['all', 'all-endpoints'].includes(queryParams.secured)) {
  config = Object.assign(config, {
    endpoints: ['https://jsonplaceholder.typicode.com']
  });
}

if (queryParams.provider !== localStorage.getItem('salte.demo.provider')) {
  localStorage.clear();
  localStorage.setItem('salte.demo.provider', queryParams.provider);
}

if (queryParams['storage-type'] !== localStorage.getItem('salte.demo.storage-type')) {
  localStorage.setItem('salte.demo.storage-type', queryParams['storage-type']);
}

const auth = new SalteAuth(config);

if (!auth.profile.idTokenExpired) refreshUserInfo();
auth.on('login', refreshUserInfo);
auth.on('refresh', refreshUserInfo);
auth.on('logout', refreshUserInfo);

elements.login.addEventListener('click', () => {
  switch (queryParams['login-type']) {
    case 'redirect':
      return auth.loginWithRedirect();
    case 'popup':
      return auth.loginWithPopup();
    case 'tab':
      return auth.loginWithNewTab();
    case 'iframe':
      return auth.loginWithIframe();
  }
});

elements.logout.addEventListener('click', () => {
  switch (queryParams['login-type']) {
    case 'redirect':
      return auth.logoutWithRedirect();
    case 'popup':
      return auth.logoutWithPopup();
    case 'tab':
      return auth.logoutWithNewTab();
    case 'iframe':
      return auth.logoutWithIframe();
  }
});

elements.navigate.addEventListener('click', () => {
  const url = new URL(location.href);
  if (location.pathname === '/') {
    url.pathname = '/account';
  } else {
    url.pathname = '/';
  }
  history.pushState({}, '', url.toString());
});

fetch('https://jsonplaceholder.typicode.com/posts/1').then((response) => {
  return response.json();
}).then((data) => {
  console.log(data);
}).catch((error) => {
  console.error(error);
});

const request = new XMLHttpRequest();
request.addEventListener('error', (event) => {
  console.error(event.detail);
});
request.addEventListener('load', function(event) {
  console.log(JSON.parse(this.responseText));
});
request.open('GET', 'https://jsonplaceholder.typicode.com/posts/2');
request.send();

class MyLitElement extends auth.mixin(LitElement) {
  render() {
    return litHtml`
      <style>
        :host {
          display: block;
        }
      </style>
      <h1>Lit</h1>
      <div>User: ${this.user && this.user.sub}</div>
      <div>Authenticated: ${this.authenticated}</div>
    `;
  }
}

customElements.define('my-lit-element', MyLitElement);
