import { Avatar, Button, Layout } from 'antd';
import * as React from 'react';

import Navigation from '@source/components/Navigation';
import './style.scss';

const Header = () => {
  return (
    <Layout.Header style={{ textAlign: 'right'}}>
      <div className="navigation-bar">
        <Navigation />
      </div>

      <Avatar
        className="user-avatar"
        size="large"
      >
        UN
      </Avatar>
      <span className="user-name">User Name</span>

      <Button
        className="logout-button"
        type="danger"
      >
        Logout
      </Button>
    </Layout.Header>
  );
};

export default Header;
