import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { Router } from 'react-router';
import { Route } from 'react-router-dom';

import AuthProvider from '@source/components/AuthProvider';
import Layout from '@source/components/Layout';
import { ApolloClient } from '@source/contexts';
import { client } from '@source/services/graphql';
import history from '@source/services/history';

const Application = () => (
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <ApolloClient.Provider value={{ client }}>
        <Router history={history}>
          <AuthProvider>
            <Route path="/" component={Layout} />
          </AuthProvider>
        </Router>
      </ApolloClient.Provider>
    </ApolloHooksProvider>
  </ApolloProvider>
);

export default Application;
