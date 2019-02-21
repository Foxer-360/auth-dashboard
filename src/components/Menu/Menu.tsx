import { Icon, Menu as AntdMenu } from 'antd';
import * as React from 'react';

const Menu = () => {
  return (
    <AntdMenu theme="dark">
      <AntdMenu.Item key="dashboard">
        <Icon type="dashboard" />
        <span>Dashboard</span>
      </AntdMenu.Item>
      <AntdMenu.Item key="settings">
        <Icon type="setting" />
        <span>Settings</span>
      </AntdMenu.Item>
    </AntdMenu>
  );
};

export default Menu;
