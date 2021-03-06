import gql from 'graphql-tag';
import { useEffect, useState } from 'react';

import { defaultValues as authUserDefaults, IAuthUserProperties } from '@source/contexts/AuthUser';
import { getAuth0Id, isLoggedIn, login, setupSession } from '@source/services/auth0';
import { client } from '@source/services/graphql';
import history from '@source/services/history';

/**
 * Custom Hook, to handle Auth0 login logic. It returns user profile with flag
 * if user is logged in and also it returns loading flag.
 *
 * @return {[boolean, IAuthUserProperties], string[]} loading, userProfile
 */
const useAuth0User = (): [boolean, IAuthUserProperties, string[] | null] => {
  const [state, setState] = useState(authUserDefaults);
  const [loading, setLoading] = useState(false);
  const [errs, setErrors] = useState([] as string[]);

  const USER_PROFILE = gql`
    query UserProfile($auth0Id: ID!) {
      user(
        where: {
          auth0Id: $auth0Id
        }
      ) {
        id
        auth0Id
        name
        email
        avatar
        superuser
        clients {
          id
          name
        }
        owns {
          id
          name
        }
      }
    }
  `;

  useEffect(() => {
    // Check if user is Logged in
    if (isLoggedIn()) {
      const auth0Id = getAuth0Id();
      // Something goes wrong
      if (!auth0Id) { return; }

      // Nothing to change
      if (state.isLogged && state.auth0Id === auth0Id) { return; }

      // Fetch data about user profile and setup state
      if (loading) { return; }

      // Some errors ? Do not fetch again
      if (errs.length > 0) { return; }

      setLoading(true);
      client.query({ query: USER_PROFILE, variables: { auth0Id } })
      .then(({ data, errors }) => {
        if (errors) {
          // Error
          // tslint:disable-next-line:no-console
          console.error(`%c[Auth]%c Error while loading user profile`, 'font-weight: bold', 'font-weight: normal', errors);
          setErrors(old => ([
            ...old,
            'Error while loading user profile',
          ]));
          setLoading(false);
          return Promise.resolve();
        }
        if (!data || !data.user) {
          // Error or User is not found
          // tslint:disable-next-line:no-console
          console.log(`%c[Auth]%c User with Auth0 ID %c${auth0Id}%c was not found in our Auth System!`,
            'color: blue; font-weight: bold', 'color: blue', 'color: green; font-weight: bold', 'color: blue');
          setErrors(old => ([
            ...old,
            `User with Auth ID ${auth0Id} was not found in our Auth System!`,
          ]));
          setLoading(false);
          return Promise.resolve();
        }

        const profile = data.user;
        setState(old => ({
          ...old,
          auth0Id,
          avatar: profile.avatar,
          clients: profile.clients,
          isLogged: true,
          isSuperUser: profile.superuser,
          name: profile.name,
          owns: profile.owns,
          userId: profile.id,
        }));
        setLoading(false);

        return Promise.resolve();
      })
      .then(() => {
        client.cache.watch({
          callback: ({ result: { user }, complete }) => {
            if (!complete) {
              return;
            }
            if (!user) {
              return;
            }
            // Check if something was changed
            let changed = false;
            if (state.avatar !== user.avatar) {
              changed = true;
            }
            if (state.isSuperUser !== user.superuser) {
              changed = true;
            }
            if (state.name !== user.name) {
              changed = true;
            }

            if (changed) {
              setState(old => ({
                ...old,
                avatar: user.avatar,
                isSuperUser: user.superuser,
                name: user.name,
              }));
            }
          },
          optimistic: false,
          query: USER_PROFILE,
          variables: { auth0Id },
        });

      });

      return;
    }

    // If we have old logged user, reset it
    if (state.isLogged) {
      setState(authUserDefaults);
    }

    // Process callback from Login Screen
    const regex = /.*\/callback.*/gi;
    if (regex.test(history.location.pathname)) {
      // Here we also can read errors
      setupSession();
      history.replace('/');
      return;
    }

    // Just redirect to Login Screen
    login();
  });

  if (errs.length < 1) {
    return [loading, state, null];
  }

  return [loading, state, errs];
}


export {
  useAuth0User,
};
