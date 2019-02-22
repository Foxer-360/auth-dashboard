import { Button, Input, Table } from 'antd';
import * as React from 'react';

import Actions from './components/Actions';
import Avatar from './components/Avatar';

interface ILooseObject {
  // tslint:disable-next-line:no-any
  [key: string]: any;
}

const columns = [
  {
    align: 'center' as 'center',
    dataIndex: 'avatar',
    render: (url: string, record: ILooseObject) => <Avatar name={record.name} url={url} />,
    title: '',
    width: '60px',
  },
  {
    dataIndex: 'name',
    key: 'name',
    title: 'Name',
  },
  {
    dataIndex: 'email',
    key: 'email',
    title: 'Email',
  },
  {
    key: 'actions',
    render: () => <Actions />,
    title: 'Actions',
  }
];

const data = [
  {
    auth0Id: 'fa17c0debc23ebc6d201',
    avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mDINeUqhlfHhmSUpart4MhSd4brkSbrJ-j3lSw9Bw=s192',
    email: 'nevim42@gmail.com',
    id: 'b1a6bc94a00e01062fbd',
    name: 'Filip Suchy',
  },
  {
    auth0Id: 'fa17c0debc23ebc6d201',
    avatar: null,
    email: 'pavel.krcil@foxmedia.cz',
    id: 'b1a6bc94a00e01062fbd',
    name: 'Pavel Krcil',
  }
];

const Users = () => {
  return (
    <div className='users-scene'>
      <Button type="primary">Add new user</Button>
      <Input style={{ width: '240px' }} placeholder="Search user name" />
      <br /><br />
      <Table
        columns={columns}
        dataSource={data}
        size="middle"
      />
    </div>
  );
};

export default Users;
