import { Layout as AntdLayout } from 'antd';
import { useState } from 'react';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import Content from '@source/components/Content';
import Header from '@source/components/Header';
import Logo from '@source/components/Logo';
import Menu from '@source/components/Menu';

import Dashboard from '@source/scenes/Dashboard';
import NotFound from '@source/scenes/NotFound';
import UserDetail from '@source/scenes/UserDetail';
import Users from '@source/scenes/Users';

import './style.scss';

const {
  Sider
} = AntdLayout;

export interface IProperties {
  location: {
    pathname: string;
  };
}

const Layout = ({ location: { pathname } }: IProperties) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AntdLayout style={{ maxHeight: '100vh' }}>
      <Sider
        collapsible={true}
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <Logo short={collapsed} />
        <Menu path={pathname}/>
      </Sider>
      <AntdLayout>
        <Header />
        <Content>
          <Switch>
            <Route exact={true} path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/users" component={Users} />
            <Route path="/user" component={UserDetail} />
            <Route component={NotFound} />
          </Switch>
        </Content>
      </AntdLayout>
    </AntdLayout>
  );
};

export default Layout;
