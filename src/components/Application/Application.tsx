import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Layout from '@source/components/Layout';

const Application = () => {
  return (
    <Router>
      <Route path="/" component={Layout} />
    </Router>
  );
};

export default Application;
