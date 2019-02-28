import auth0 from 'auth0-js';
import * as decode from 'jwt-decode';

import { readEnvironmentVariable } from '@source/utils';


export interface IAuth0Result {
  idToken?: string;
  accessToken?: string;
  expiresIn?: string;
}

const DEBUG_MESSAGES = false;

const StorageDef = {
  accessToken: 'access_token',
  expiresAt: 'expires_at',
  idToken: 'id_token',
};

const Auth0Def = {
  audience: readEnvironmentVariable('auth0_audience'),
  clientId: readEnvironmentVariable('auth0_client_id'),
  domain: readEnvironmentVariable('auth0_client_domain'),
  redirect: readEnvironmentVariable('auth0_redirect'),
  responseType: 'token id_token',
  returnTo: 'http://localhost:9000',
  scope: 'openid profile email picture',
};

const Env = readEnvironmentVariable('node_env').toLowerCase();

// Instance for renew timer, only one in whole application
let renewTimerInstance = null as any;


/**
 * Create Auth0 object
 */
const auth = new auth0.WebAuth({
  clientID: Auth0Def.clientId,
  domain: Auth0Def.domain,
});


/**
 * Simple login function which redirects to Auth0 Login Screen
 */
const login = () => {
  auth.authorize({
    audience: Auth0Def.audience,
    redirectUri: Auth0Def.redirect,
    responseType: Auth0Def.responseType,
    scope: Auth0Def.scope,
  });
};

/**
 * Simple logout function which redirects to Auth0 logout route
 *
 * @param {boolean} err flag if logout function is called after some auth error
 */
const logout = (err?: boolean) => {
  clearSession();

  // Do not logout from auth0, if it's after error and on development env
  if (Env === 'development' && err && DEBUG_MESSAGES) {
    return;
  }

  auth.logout({
    clientID: Auth0Def.clientId,
    returnTo: Auth0Def.returnTo,
  });
};

/**
 * Simple function which will renew token in Auth0
 */
const renew = () => {
  debug('info', '%c[Auth] Renewing token...', 'color: green');
  auth.checkSession({
    audience: Auth0Def.audience,
    redirectUri: Auth0Def.redirect,
    responseType: Auth0Def.responseType,
    scope: Auth0Def.scope,
  }, (err, authResult) => {
    if (err) {
      // Log this error into console on development env
      debug('error', `[Auth] Renew token error: %c${err.error}`, 'font-weight: bold', err);
      logout(true);
    } else {
      setupSession(authResult);
    }
  });
};

/**
 * This function will save tokens into local storage. Token is from authResult
 * (case of renewing of tokens) or from url (case of login which redirects to
 * callback). Also this method setup expires date and start timer to renew
 * token after expiration.
 */
const setupSession = (authResult?: IAuth0Result) => {
  // If its redirect from auth0 login screen, check for errors
  if (!authResult) {
    const error = getParameterFromUrlByName('error');
    if (error) {
      // Log this error into console on development env
      debug('error', `[Auth] Login error: %c${error}`, 'font-weight: bold');
      logout(true);
      return;
    }
  }

  const idToken = (authResult && authResult.idToken) || getParameterFromUrlByName(StorageDef.idToken);
  const accessToken = (authResult && authResult.accessToken) || getParameterFromUrlByName(StorageDef.accessToken);

  // Something goes wrong. There is no ID or Access token -> Logout
  if (!idToken || !accessToken) {
    logout();
    return;
  }

  const expiresAt = getTokenExpirationDate(idToken);
  // If we have no idea about expiration, then logout
  if (!expiresAt) {
    logout();
    return;
  }

  const expiresIn = (authResult && authResult.expiresIn) || (expiresAt.getTime() - new Date().getTime());

  // Save into local storage all informations
  saveIntoLocalStorage(idToken, accessToken, expiresAt);

  // Setup renew token timer only on reasonable time
  if (expiresIn > 10) { setupRenewTimer(expiresIn); }
};

/**
 * Simple method to clear session. It means remove all auth informations from
 * local storage and cancel renew timer
 */
const clearSession = () => {
  clearLocalStorage();
  if (renewTimerInstance) {
    clearTimeout(renewTimerInstance);
  }
};

/**
 * Decode expiration from given ID Token.
 *
 * @param {string} encodedToken it's id token from auth0
 * @return {Date | null}
 */
const getTokenExpirationDate = (encodedToken: string) => {
  const token = decode<{ exp?: number }>(encodedToken);
  if (!token.exp) {
    return null;
  }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
};

/**
 * Helper function which parse value of given parameter name from URL address.
 * If there is no window object, then returns null.
 *
 * @param {string} name
 * @return {string | null}
 */
const getParameterFromUrlByName = (name: string): string | null => {
  if (!window || !window.location || !window.location.hash) {
    return null;
  }
  const match = RegExp(`[#&]${name}=([^&]*)`).exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

/**
 * Simple function to save all auth informations into local storage.
 *
 * @param {string} idToken
 * @param {string} accessToken
 * @param {Date} expiresAt
 */
const saveIntoLocalStorage = (idToken: string, accessToken: string, expiresAt: Date) => {
  if (!window) { return; }

  localStorage.setItem(StorageDef.idToken, idToken);
  localStorage.setItem(StorageDef.accessToken, accessToken);
  localStorage.setItem(StorageDef.expiresAt, expiresAt.getTime().toString());
};

/**
 * Simple function to remove all auth informations from local storage. For
 * example after logout.
 */
const clearLocalStorage = () => {
  if (!window) { return; }

  localStorage.removeItem(StorageDef.idToken);
  localStorage.removeItem(StorageDef.accessToken);
  localStorage.removeItem(StorageDef.expiresAt);
};

/**
 * Function to setup new timer for renewing auth tokens.
 *
 * @param {number | string} expiresIn
 */
const setupRenewTimer = (expiresIn: number | string) => {
  // Stop already running
  if (renewTimerInstance) {
    clearTimeout(renewTimerInstance);
  }

  // Make sure, expiresIn is number and correct
  if (!expiresIn) {
    return;
  }
  if (typeof expiresIn !== 'number') {
    expiresIn = parseInt(expiresIn, 0);
    if (isNaN(expiresIn)) {
      return;
    }
  }

  debug('info', `%c[Auth] Setup renew timer to ${expiresIn / 1000} seconds`, 'color: green');

  renewTimerInstance = setTimeout(() => {
    renew();
  }, expiresIn);
}

/**
 * Simple check, if token of current session is already expired.
 */
const isTokenExpired = () => {
  if (!window) { return true; }

  const expiresAt = localStorage.getItem(StorageDef.expiresAt);
  if (!expiresAt) {
    return true;
  }

  return new Date(parseInt(expiresAt, 0)) < new Date();
};

/**
 * Simple check if user is logged in. This check is used very often. So we
 * also check, if we have setup timer for renew.
 */
const isLoggedIn = () => {
  if (!window) { return false; }

  const idToken = localStorage.getItem(StorageDef.idToken);
  const loggedIn = !!idToken && !isTokenExpired();

  // Setup new renew timer if necessary
  if (loggedIn) {
    if (!renewTimerInstance) {
      const expiredAt = parseInt(getExpiresAt() as string, 0);
      const expiresIn = expiredAt - new Date().getTime();

      setupRenewTimer(expiresIn);
    }
  }

  return loggedIn;
};

/**
 * Simple getter for ID token from local storage
 */
const getIdToken = () => {
  if (!window) { return null; }

  return localStorage.getItem(StorageDef.idToken);
};

/**
 * Simple getter for Access token from local storage
 */
const getAccessToken = () => {
  if (!window) { return null; }

  return localStorage.getItem(StorageDef.accessToken);
};

/**
 * Simple getter for expires at from local storage
 */
const getExpiresAt = () => {
  if (!window) { return null; }

  return localStorage.getItem(StorageDef.expiresAt);
};

/**
 * Simple function to decode Access token and parse auth0Id
 */
const getAuth0Id = () => {
  if (!window) { return null; };

  const accessToken = getAccessToken();
  if (!accessToken) { return null; }

  const { sub } = decode<{ sub: string }>(accessToken);
  if (!sub) { return null; };

  const regex = /^.*\|([^\|]+)$/gi;
  const res = regex.exec(sub);
  if (!res || !res[1]) { return null; };

  return res[1];
};

/**
 * Simple helper to show debug message
 */
const debug = (type: string, ...args: any[]) => {
  if (Env !== 'development' || !DEBUG_MESSAGES) { return; }

  switch (type) {
    case 'error':
      // tslint:disable-next-line:no-console
      console.error(...args);
      return;
    case 'warn':
      // tslint:disable-next-line:no-console
      console.warn(...args);
      return;
    case 'info':
      // tslint:disable-next-line:no-console
      console.log(...args);
      return;
    default:
      return;
  }
};


export {
  clearSession,
  getAccessToken,
  getAuth0Id,
  getExpiresAt,
  getIdToken,
  isLoggedIn,
  isTokenExpired,
  login,
  logout,
  setupSession,
}
