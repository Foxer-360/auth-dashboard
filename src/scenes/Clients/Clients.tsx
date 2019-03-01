import { Button/*, Col*/, Input, Row, Table } from 'antd';
import * as React from 'react';
import { useState } from 'react';

import Form from './components/Form';

const Actions = () => (
  <>
    <Button
      type="primary"
      icon="edit"
      size="small"
      style={{ marginRight: '8px' }}
    >
      Edit
    </Button>
    <Button
      type="danger"
      icon="delete"
      size="small"
    >
      Delete
    </Button>
  </>
);

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
    render: () => (<Actions />),
    title: "Actions",
    width: '260px',
  }
];

const dataSource = [{
  id: '7234kjnfds98fn234',
  name: 'FoxMedia Czech Republic',
  projects: 2,
  websites: 4,
}, {
  id: 'l5498dmn20-cn430392n2340-2',
  name: 'Koh-I-Noor',
  projects: 1,
  websites: 1,
}, {
  id: '7234kjnfds98fn234',
  name: 'FoxMedia Czech Republic',
  projects: 2,
  websites: 4,
}, {
  id: 'l5498dmn20-cn430392n2340-2',
  name: 'Koh-I-Noor',
  projects: 1,
  websites: 1,
}, {
  id: '7234kjnfds98fn234',
  name: 'FoxMedia Czech Republic',
  projects: 2,
  websites: 4,
}, {
  id: 'l5498dmn20-cn430392n2340-2',
  name: 'Koh-I-Noor',
  projects: 1,
  websites: 1,
}, {
  id: '7234kjnfds98fn234',
  name: 'FoxMedia Czech Republic',
  projects: 2,
  websites: 4,
}, {
  id: 'l5498dmn20-cn430392n2340-2',
  name: 'Koh-I-Noor',
  projects: 1,
  websites: 1,
}, {
  id: '7234kjnfds98fn234',
  name: 'FoxMedia Czech Republic',
  projects: 2,
  websites: 4,
}, {
  id: 'l5498dmn20-cn430392n2340-2',
  name: 'Koh-I-Noor',
  projects: 1,
  websites: 1,
}, {
  id: '7234kjnfds98fn234',
  name: 'FoxMedia Czech Republic',
  projects: 2,
  websites: 4,
}, {
  id: 'l5498dmn20-cn430392n2340-2',
  name: 'Koh-I-Noor',
  projects: 1,
  websites: 1,
}, {
  id: '7234kjnfds98fn234',
  name: 'FoxMedia Czech Republic',
  projects: 2,
  websites: 4,
}, {
  id: 'l5498dmn20-cn430392n2340-2',
  name: 'Koh-I-Noor',
  projects: 1,
  websites: 1,
}, {
  id: '7234kjnfds98fn234',
  name: 'FoxMedia Czech Republic',
  projects: 2,
  websites: 4,
}, {
  id: 'l5498dmn20-cn430392n2340-2',
  name: 'Koh-I-Noor',
  projects: 1,
  websites: 1,
}, {
  id: '7234kjnfds98fn234',
  name: 'FoxMedia Czech Republic',
  projects: 2,
  websites: 4,
}, {
  id: 'l5498dmn20-cn430392n2340-2',
  name: 'Koh-I-Noor',
  projects: 1,
  websites: 1,
}, {
  id: '7234kjnfds98fn234',
  name: 'FoxMedia Czech Republic',
  projects: 2,
  websites: 4,
}, {
  id: 'l5498dmn20-cn430392n2340-2',
  name: 'Koh-I-Noor',
  projects: 1,
  websites: 1,
}].map((rec, index) => {
  const res = {
    ...rec,
    key: index,
  }

  return res;
});

const Clients = () => {
  const [search, setSearch] = useState('');
  const updateSearch = (val: string) => {
    setSearch(val);
  };

  // Filter data before render
  const filterRegEx = RegExp(`.*${search}.*`);
  let data = [ ...dataSource ];
  if (search.length > 1) {
    data = dataSource.filter((rec) => {
      return filterRegEx.test(rec.name)
    });
  }

  return (
    <div>
      <Row style={{ marginBottom: '42px' }}>
        <Button type="primary" style={{ marginRight: '24px' }}>Add new Client</Button>
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
          dataSource={data}
          size="middle"
        />
      </Row>
      <Row style={{ marginTop: '42px' }}>
        <Form />
      </Row>
    </div>
  );
};

export default Clients;
