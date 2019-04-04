import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { OperationDefinitionNode } from 'graphql';

import { readEnvironmentVariable } from '@source/utils';
import { authLink, errorLink, httpLink, stateLink/*, wsLink*/ } from './links';

// Load environment (development, production) from .env
const Env = readEnvironmentVariable('node_env').toLowerCase();

// Simple InMemory Cache
const cache = new InMemoryCache();

// Split links into HTTP and WS by OperationDefinition
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query) as OperationDefinitionNode;
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  // wsLink,
  httpLink
);

// Create ApolloClient instance
const localState = stateLink(cache);
const combinedLink = ApolloLink.from([
  localState,
  authLink,
  errorLink,
  link,
]);

const client = new ApolloClient({
  cache,
  connectToDevTools: Env === 'development',
  link: combinedLink,
});


export {
  client,
};
