import { Layout } from 'antd';
import * as React from 'react';

import './style.scss';

interface IProperties {
  children: React.ReactElement | React.ReactElement[];
}

const Content = ({ children }: IProperties) => {
  return (
    <Layout.Content>
      <div className="content-holder">
        {children}
      </div>
    </Layout.Content>
  );
};

export default Content;
