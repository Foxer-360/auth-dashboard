import { Icon, Menu as AntdMenu } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';

export interface IProperties {
  path?: string;
}

const getMenuKeyFromPath = (path: string): string => {
  const regex = /^\/?([^\/]+).*$/gi;
  const match = regex.exec(path);

  if (!match || !match[1]) {
    return 'dashboard';
  }

  switch (match[1]) {
    case '':
    case 'dashboard':
      return 'dashboard';
    case 'user':
    case 'users':
      return 'users';
    case 'settings':
      return 'settings';
    default:
      return '';
  }
};

const Menu = ({ path }: IProperties) => {
  let key = '';
  if (path) {
    key = getMenuKeyFromPath(path);
  }

  return (
    <AntdMenu theme="dark" selectedKeys={[key]}>
      <AntdMenu.Item key="dashboard">
        <Link to="/">
          <Icon type="dashboard" />
          <span>Dashboard</span>
        </Link>
      </AntdMenu.Item>
      <AntdMenu.Item key="users">
        <Link to="/users">
          <Icon type="user" />
          <span>Users</span>
        </Link>
      </AntdMenu.Item>
      <AntdMenu.Item key="settings">
        <Link to="/settings">
          <Icon type="setting" />
          <span>Settings</span>
        </Link>
      </AntdMenu.Item>
    </AntdMenu>
  );
};

export default Menu;
