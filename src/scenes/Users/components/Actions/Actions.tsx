import { Button } from 'antd';
import * as React from 'react';

const Actions = () => {
  return (
    <>
      <Button type="primary" size="small">Edit</Button>
      <Button style={{ marginLeft: '12px' }} size="small" type="danger">Delete</Button>
    </>
  );
};

export default Actions;
