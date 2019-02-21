import { Breadcrumb, Icon } from 'antd';
import * as React from 'react';

const Navigation = () => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">
        <Icon type="home" />
        <span>Auth Dashboard</span>
      </Breadcrumb.Item>
      <Breadcrumb.Item href="/users">
        <Icon type="user" />
        <span>Users</span>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default Navigation;
