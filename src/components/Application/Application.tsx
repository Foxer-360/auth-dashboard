import * as React from 'react';
import { Router } from 'react-router';
import { Route } from 'react-router-dom';

import AuthProvider from '@source/components/AuthProvider';
import Layout from '@source/components/Layout';
import history from '@source/services/history';


const Application = () => (
  <Router history={history}>
    <AuthProvider>
      <Route path="/" component={Layout} />
    </AuthProvider>
  </Router>
);

export default Application;
