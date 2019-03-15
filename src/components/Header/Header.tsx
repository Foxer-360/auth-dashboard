import { Avatar, Button, Layout } from 'antd';
import * as React from 'react';
import { useContext } from 'react';

import Navigation from '@source/components/Navigation';
import AuthUser from '@source/contexts/AuthUser';
import { logout } from '@source/services/auth0';
import './style.scss';

const Header = () => {
  const { avatar, name } = useContext(AuthUser);

  return (
    <Layout.Header style={{ textAlign: 'right'}}>
      <div className="navigation-bar">
        <Navigation />
      </div>

      <Avatar
        className="user-avatar"
        size="large"
        shape="square"
        src={avatar}
      >
        UN
      </Avatar>
      <span className="user-name">{name}</span>

      <Button
        className="logout-button"
        type="danger"
        onClick={() => logout()}
      >
        Logout
      </Button>
    </Layout.Header>
  );
};

export default Header;
