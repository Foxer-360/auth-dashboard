import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Router } from 'react-router';
import { Route } from 'react-router-dom';

import AuthProvider from '@source/components/AuthProvider';
import Layout from '@source/components/Layout';
import { client } from '@source/services/graphql';
import history from '@source/services/history';

const Application = () => (
  <ApolloProvider client={client}>
    <Router history={history}>
      <AuthProvider>
        <Route path="/" component={Layout} />
      </AuthProvider>
    </Router>
  </ApolloProvider>
);

export default Application;
