import { Button, Input, Table, Tag } from 'antd';
import * as React from 'react';
import { useState } from 'react';

import history from '@source/services/history';
import Actions from './components/Actions';
import Avatar from './components/Avatar';
import Errors from './components/Errors';
import { IClient, IUserRecord, useUsers } from './hooks';


const columns = [
  {
    align: 'center' as 'center',
    dataIndex: 'avatar',
    render: (url: string, record: IUserRecord) => <Avatar name={record.name} url={url} />,
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
    dataIndex: 'clients',
    render: (clients: IClient[]) => (<>{clients.map((client) => <Tag color="volcano" key={client.id}>{client.name}</Tag>)}</>),
    title: 'Clients',
  },
  {
    dataIndex: 'id',
    key: 'actions',
    render: (id: string) => <Actions id={id} />,
    title: 'Actions',
  }
];


const Users = () => {
  const [users, errors, loading] = useUsers();
  const [search, setSearch] = useState('');

  let filteredUsers = users as IUserRecord[];
  if (search.length > 1) {
    filteredUsers = filteredUsers.filter((rec) => {
      const regex = RegExp(`.*${search}.*`);
      if (regex.test(rec.name) || regex.test(rec.email)) {
        return true;
      }

      return false;
    });
  }

  const updateSearch = (value: string) => {
    setSearch(value);
  };

  const handleAddUser = () => {
    history.push('/user');
  };

  return (
    <div className="users-scene">
      <div style={{ marginBottom: '24px' }}>
        <Button type="primary" onClick={handleAddUser}>Add new users</Button>
        <Input.Search
          placeholder="Search for User"
          enterButton="Search"
          style={{ width: '520px', marginLeft: '24px' }}
          onSearch={updateSearch}
        />
      </div>

      <Errors errors={errors} />

      <Table
        columns={columns}
        dataSource={filteredUsers as IUserRecord[]}
        size="middle"
        loading={loading as boolean}
      />
    </div>
  );
};

export default Users;
