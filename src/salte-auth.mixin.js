const SalteAuthMixinGenerator = function(auth) {
  const registeredMixedIns = [];

  auth.on('login', (error, user) => {
    if (error) {
      console.error(error);
      return;
    }

    for (let i = 0; i < registeredMixedIns.length; i++) {
      registeredMixedIns[i].user = user;
      registeredMixedIns[i].authenticated = !auth.profile.idTokenExpired;
    }
  });

  auth.on('logout', (error) => {
    if (error) {
      console.error(error);
      return;
    }

    for (let i = 0; i < registeredMixedIns.length; i++) {
      registeredMixedIns[i].user = null;
      registeredMixedIns[i].authenticated = false;
    }
  });

  auth.on('expired', () => {
    for (let i = 0; i < registeredMixedIns.length; i++) {
      registeredMixedIns[i].authenticated = false;
    }
  });

  return function(superClass) {
    return class extends superClass {
      constructor() {
        super();

        registeredMixedIns.push(this);
        this.user = auth.profile.userInfo || null;
        this.authenticated = !auth.profile.idTokenExpired;
      }

      get auth() {
        return auth;
      }

      get user() {
        return this.$$user;
      }

      set user(user) {
        const oldUser = this.$$user;

        this.$$user = user;
        if (this.requestUpdate) {
          this.requestUpdate('user', oldUser);
        }
      }

      get authenticated() {
        return this.$$authenticated;
      }

      set authenticated(authenticated) {
        const oldAuthenticated = this.$$authenticated;

        this.$$authenticated = authenticated;
        if (this.requestUpdate) {
          this.requestUpdate('authenticated', oldAuthenticated);
        }
      }
    };
  };
};

export { SalteAuthMixinGenerator };
export default SalteAuthMixinGenerator;
