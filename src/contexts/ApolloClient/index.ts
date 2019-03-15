import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createContext } from 'react';

export interface IApolloClientProperties {
  client: ApolloClient<NormalizedCacheObject> | null;
}

export const defaultValues = {
  client: null,
} as IApolloClientProperties;

const Client = createContext(defaultValues);

export default Client;
