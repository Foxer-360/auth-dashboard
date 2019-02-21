import { Layout } from 'antd';
import * as React from 'react';
import { useState } from 'react';

import Content from '@source/components/Content';
import Header from '@source/components/Header';
import Logo from '@source/components/Logo';
import Menu from '@source/components/Menu';

const {
  Sider
} = Layout;

const Application = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ maxHeight: '100vh' }}>
      <Sider
        collapsible={true}
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <Logo short={collapsed} />
        <Menu />
      </Sider>
      <Layout>
        <Header />
        <Content>
          <span>Application</span>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Application;
