import { Breadcrumb, Icon } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link className="ant-breadcrumb-link" to="/">
          <Icon type="home" />
          <span>Auth Dashboard</span>
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link className="ant-breadcrumb-link" to="users">
          <Icon type="user" />
          <span>Users</span>
        </Link>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default Navigation;
