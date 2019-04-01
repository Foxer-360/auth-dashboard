import { Button, Popconfirm } from 'antd';
import gql from 'graphql-tag';
import * as React from 'react';
import { useMutation } from 'react-apollo-hooks';

import history from '@source/services/history';


const DELETE_CLIENT = gql`
  mutation ($id: ID!) {
    deleteClient(
      where: {
        id: $id
      }
    ) {
      id
      name
    }
  }
`;

const Actions = ({ id }: { id: string }) => {
  const deleteUser = useMutation(DELETE_CLIENT, { update: (proxy, result) => {
    const clientList = proxy.readQuery({ query: gql`{ clients { id } }` }) as { clients: any[] };

    if (!clientList || !clientList.clients) {
      return;
    }
    proxy.writeQuery({
      data: { clients: clientList.clients.filter((client) => client.id !== id) },
      query: gql`{ clients { id }}`,
    });
  }, variables: { id } });

  const handleEdit = () => {
    history.push(`/client/${id}`);
  };

  const handleDelete = () => {
    deleteUser();
  };

  return (
    <>
      <Button
        type="primary"
        icon="edit"
        size="small"
        style={{ marginRight: '8px' }}
        onClick={handleEdit}
      >
        Edit
      </Button>
      <Popconfirm
        title="Are you sure?"
        okText="Delete"
        cancelText="Keep"
        okType="danger"
        onConfirm={handleDelete}
      >
        <Button
          type="danger"
          icon="delete"
          size="small"
        >
          Delete
        </Button>
      </Popconfirm>
    </>
  );
};

export default Actions;
