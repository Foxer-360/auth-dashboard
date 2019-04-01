import { Icon, Menu as AntdMenu } from 'antd';
import * as React from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

import AuthUser from '@source/contexts/AuthUser';

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
    case 'client':
    case 'clients':
      return 'clients';
    case 'settings':
      return 'settings';
    case 'notfound':
      return 'notfound';
    default:
      return '';
  }
};

interface IItemDefProperties {
  name: string;
  to: string;
  type: string;
}

const { Item } = AntdMenu;

const ItemDef = ({ name, to, type }: IItemDefProperties) => (
  <Link to={to}>
    <Icon type={type} />
    <span>{name}</span>
  </Link>
);

const Menu = ({ path }: IProperties) => {
  let key = '';
  if (path) {
    key = getMenuKeyFromPath(path);
  }

  const { isSuperUser } = useContext(AuthUser);

  return (
    <AntdMenu theme="dark" selectedKeys={[key]}>
      <Item key="dashboard">
        <ItemDef name="Dashboard" to="/" type="dashboard" />
      </Item>

      {
        isSuperUser ?
          <Item key="clients">
            <ItemDef name="Clients" to="/clients" type="deployment-unit" />
          </Item>
        : null
      }

      <Item key="users">
        <ItemDef name="Users" to="/users" type="team" />
      </Item>

      <Item key="settings">
        <ItemDef name="Settings" to="/settings" type="setting" />
      </Item>

      {
        isSuperUser ?
          <Item key="notfound">
            <ItemDef name="NotFound Test" to="/notfound" type="eye" />
          </Item>
        : null
      }
    </AntdMenu>
  );
};

export default Menu;
