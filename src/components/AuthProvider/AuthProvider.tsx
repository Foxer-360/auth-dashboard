import * as React from 'react';
import { useEffect, useState } from 'react';

import { isLoggedIn, login, setupSession } from '@source/services/auth0';
import history from '@source/services/history';


export interface IProperties {
  children: React.ReactElement;
}

/**
 * Custom Hook, to handle Auth0 login logic. It returns state if we are logged
 * in and we can show content.
 *
 * @return {boolean} state flag, if user is logged in
 */
const useAuth0 = (): boolean => {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    // Check if user is Logged in
    if (isLoggedIn()) {
      setLogged(true);
      return;
    }

    // Reset logged state
    setLogged(false);

    // Process callback from Login Screen
    const regex = /.*\/callback.*/gi;
    if (regex.test(history.location.pathname)) {
      setupSession();
      history.replace('/');
      return;
    }

    // Just redirect to Login Screen
    login();
  });

  return logged;
};

const AuthProvider = ({ children }: IProperties) => {
  const logged = useAuth0();

  if (!logged) { return null; }

  return ( <>{children}</> );
};

export default AuthProvider;
