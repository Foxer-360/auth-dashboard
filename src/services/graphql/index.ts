import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';

import { readEnvironmentVariable } from '@source/utils';
import { authLink, errorLink, httpLink, stateLink } from './links';

// Load environment (development, production) from .env
const Env = readEnvironmentVariable('node_env').toLowerCase();

// Simple InMemory Cache
const cache = new InMemoryCache();

// Create ApolloClient instance
const localState = stateLink(cache);
const combinedLink = ApolloLink.from([
  localState,
  authLink,
  errorLink,
  httpLink,
]);

const client = new ApolloClient({
  cache,
  connectToDevTools: Env === 'development',
  link: combinedLink,
});


export {
  client,
};
