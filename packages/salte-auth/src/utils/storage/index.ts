import { CookieStorage } from './cookie-storage';
import { LocalStorage } from './local-storage';
import { SessionStorage } from './session-storage';

export const StorageTypes = {
  cookie: CookieStorage,
  local: LocalStorage,
  session: SessionStorage
};

export { CookieStorage, LocalStorage, SessionStorage };
