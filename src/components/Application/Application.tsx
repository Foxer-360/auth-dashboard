import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Layout from '@source/components/Layout';
import { isLoggedIn, login, setupSession } from '@source/services/auth0';

// Define Login rutine... If we are not logged, show login screen, if we
// return from login screen, parse tokens and continue to homepage
const authRutine = (): boolean => {
  // If we have no window object, then it's not logged
  if (!window || !window.location || !window.location.pathname) {
    return false;
  }

  // Callback from Login screen
  const pathRegex = /.*\/callback.*/gi;
  if (pathRegex.test(window.location.pathname)) {
    setupSession();

    // Redirect to homepage
    window.location.replace('/');

    return false;
  }

  if (isLoggedIn()) {
    return true;
  }

  // Redirect to login screen
  login();

  return false;
};

const Application = () => {
  // Do Auth rutine
  if (!authRutine()) {
    return null;
  }

  return (
    <Router>
      <Route path="/" component={Layout} />
    </Router>
  );
};

export default Application;
