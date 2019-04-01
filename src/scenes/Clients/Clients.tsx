import { Alert, Button/*, Col*/, Input, Row, Table } from 'antd';
import * as React from 'react';
import { useState } from 'react';

import history from '@source/services/history';
import Actions from './components/Actions';
import { useClients } from './hooks';


const cutId = (id: string): string => {
  const res = `#${id.substr(0, 6)}...`;
  return res;
};

const columns = [
  {
    align: 'center' as 'center',
    dataIndex: "id",
    render: (rec: string) => <b>{cutId(rec)}</b>,
    title: 'ID',
    width: '130px',
  }, {
    dataIndex: "name",
    title: 'Name',
  }, {
    align: 'center' as 'center',
    dataIndex: "projects",
    title: "# Projects",
    width: '120px',
  }, {
    align: 'center' as 'center',
    dataIndex: "websites",
    title: "# Websites",
    width: '120px',
  }, {
    align: 'center' as 'center',
    dataIndex: 'key',
    render: (id: string) => (<Actions id={id}/>),
    title: "Actions",
    width: '260px',
  }
];

const Clients = () => {
  const [search, setSearch] = useState('');
  const updateSearch = (val: string) => {
    setSearch(val);
  };

  const handleNewClient = () => {
    history.push('/client');
  };

  const [data, errors, loading] = useClients();

  if (errors) {
    return (
      <div>
        <Row style={{ marginBottom: '42px' }}>
          <Button type="primary" style={{ marginRight: '24px' }} onClick={handleNewClient}>Add new Client</Button>
          <Input.Search
            placeholder="Search for Client"
            enterButton="Search"
            style={{ width: '520px' }}
            onSearch={updateSearch}
          />
        </Row>
        <Row>
          {errors.map((err, index) => (
            <Alert
              message="Error"
              key={index}
              description={err.message}
              type="error"
              showIcon={true}
            />
          ))}
        </Row>
      </div>
    );
  }

  // Filter data before render
  const filterRegEx = RegExp(`.*${search}.*`);
  let filteredData = [ ...data ];
  if (search.length > 1) {
    filteredData = data.filter((rec) => {
      return filterRegEx.test(rec.name)
    });
  }

  return (
    <div>
      <Row style={{ marginBottom: '42px' }}>
        <Button type="primary" style={{ marginRight: '24px' }} onClick={handleNewClient}>Add new Client</Button>
        <Input.Search
          placeholder="Search for Client"
          enterButton="Search"
          style={{ width: '520px' }}
          onSearch={updateSearch}
        />
      </Row>
      <Row>
        <Table
          columns={columns}
          dataSource={filteredData}
          size="middle"
          loading={loading}
        />
      </Row>
    </div>
  );
};

export default Clients;
