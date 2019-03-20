import { Dropdown, Input, Menu, Spin, Tooltip } from 'antd';
import gql from 'graphql-tag';
import * as React from 'react';
import { useContext, useState } from 'react';
import { useQuery } from 'react-apollo-hooks';

import AuthUser from '@source/contexts/AuthUser';


export interface IProperties {
  clients: string[];
  style?: React.CSSProperties;
  disabled?: boolean;

  onAssign?: (clientId: string) => void;
}


const ALL_CLIENTS_QUERY = gql`{
  clients {
    id
    name
  }
}`;

const AssignClient = ({ clients: usedClients, style, disabled, onAssign }: IProperties) => {
  const [value, setValue] = useState('');
  let { owns: clients } = useContext(AuthUser);
  const { isSuperUser } = useContext(AuthUser);

  // For superusers load all clients
  if (isSuperUser) {
    const { data, errors, loading } = useQuery(ALL_CLIENTS_QUERY);

    if (loading) {
      return (
        <div style={style ? style : {}}>
          <Spin>
            <Dropdown
              overlay="Loading..."
              trigger={['click']}
              disabled={disabled}
            >
              <Input addonBefore="Assign Client" value={value} />
            </Dropdown>
          </Spin>
        </div>
      );
    }

    if (!errors && !loading && data && data.clients) {
      clients = data.clients;
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }

  const handleFocus = () => {
    setValue('');
  }

  const handleAssign = ({ key }: { key: string }) => {
    setValue('');
    if (onAssign) {
      onAssign(key);
    }
  }

  const used = usedClients ? usedClients : [];
  let filteredClients = clients.filter((client) => !used.includes(client.id));

  // Filter clients
  if (value.length >= 2 && clients.length >= 1) {
    const regex = RegExp(`.*(${value}).*`, 'i');
    filteredClients = filteredClients.filter((client) => {
      if (regex.test(client.name)) {
        return true;
      }

      return false;
    });
  }

  const divStyle = {
    border: 'none',
    borderRadius: '4px',
    boxShadow: '0px 0px 4px 1px rgba(0, 0, 0, 0.2)',
    padding: '6px 12px',
    width: '100%',
  } as React.CSSProperties;

  let List: JSX.Element;
  if (filteredClients.length < 1) {
    List = (
      <div style={divStyle}>
        <span>No clients was found!</span>
      </div>
    );
  } else {
    List = (
      <Menu
        style={{ maxHeight: '128px', overflowY: 'auto', overflowX: 'hidden' }}
        onClick={handleAssign}
      >
        {filteredClients.map((client) => (
          <Menu.Item key={client.id}>{client.name}</Menu.Item>
        ))}
      </Menu>
    );
  }

  return (
    <div style={style ? style : {}}>
      <Dropdown
        overlay={List}
        trigger={['click']}
        disabled={disabled}
      >
        <Input
          addonBefore={<Tooltip title="You can only assign clients which you owns!">Assign Client</Tooltip>}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
        />
      </Dropdown>
    </div>
  );
};

export default AssignClient;
