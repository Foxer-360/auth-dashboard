import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { withClientState } from 'apollo-link-state';
import { GraphQLError } from 'graphql';

import { getAccessToken } from '@source/services/auth0';
import { buildUrlFromEnv, readEnvironmentVariable } from '@source/utils';
import * as localState from './local';


const DEBUG_MESSAGES = true;

const Env = readEnvironmentVariable('node_env');

// Define local state in Apollo cache
const stateLink = (cache: InMemoryCache) => withClientState({
  cache,
  ...localState,
});

// HTTP link, this is main link for graphql communication
const graphqlUrl = buildUrlFromEnv('graphql_server_host', 'graphql_server_port', 'graphql_server_path');
const httpLink = new HttpLink({ uri: graphqlUrl });

// Error link is for purposes of some error during GraphQL communication
const errorLink = onError(({ graphQLErrors, networkError }) => {
  const bold = 'font-weight: bold';
  const normal = 'font-weight: normal';

  const errorMapFce = ({ message, locations, path }: GraphQLError) => {
    debug(
      'error',
      `[GraphQL] Error message: %c${message}%c, Location: %c${locations}%c, Path: %c${path}`,
      bold, normal, bold, normal, bold
    );
  };

  // Show GraphQL errors
  if (graphQLErrors) {
    graphQLErrors.map(errorMapFce);
  }

  // Show network errors
  if (networkError) {
    debug('error', `[Network] Error message: %c${networkError}`, bold);
  }
});

// Auth link will inject access token into headers to provide secure
// communication
const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

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
  authLink,
  errorLink,
  httpLink,
  stateLink,
};
