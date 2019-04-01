import { Button, Popconfirm, Tooltip } from 'antd';
import gql from 'graphql-tag';
import * as React from 'react';
import { useContext } from 'react';
import { useMutation } from 'react-apollo-hooks';

import AuthUser from '@source/contexts/AuthUser';
import history from '@source/services/history';

export interface IProperties {
  id: string;
}

const DELETE_USER = gql`
  mutation ($id: ID) {
    deleteUser(
      where: {
        id: $id
      }
    ) {
      id
      name
    }
  }
`;

const Actions = ({ id }: IProperties) => {
  const { userId } = useContext(AuthUser);

  const deleteMutation = useMutation(DELETE_USER, { update: (proxy, res) => {
    const usersList = proxy.readQuery({ query: gql`{ users { id name } }` }) as { users: any[] };

    if (!usersList || !usersList.users) {
      return;
    }
    proxy.writeQuery({
      data: { users: usersList.users.filter((user) => user.id !== id) },
      query: gql`{ users { id name } }`,
    });
  }, variables: { id } });

  // Check if it's current user
  let currentUser = false;
  if (userId === id) {
    currentUser = true;
  }

  const goToEditation = () => {
    history.push(`/user/${id}`);
  };

  const deleteUser = () => {
    // tslint:disable-next-line:no-console
    console.log(`Id is: ${id}`);
    deleteMutation({ variables: { id } });
  };

  return (
    <>
      <Button
        type="primary"
        size="small"
        icon="edit"
        onClick={goToEditation}
      >
        Edit
      </Button>

      {currentUser ?
        <Tooltip
          title="You cannot delete yourself!"
        >
          <Button
            style={{ marginLeft: '12px' }}
            size="small"
            type="danger"
            icon="delete"
            disabled={true}
          >
            Delete
          </Button>
        </Tooltip>
        :
        <Popconfirm
          title="Are you sure?"
          okText="Delete"
          cancelText='Keep'
          okType="danger"
          onConfirm={deleteUser}
        >
          <Button
            style={{ marginLeft: '12px' }}
            size="small"
            type="danger"
            icon="delete"
          >
            Delete
          </Button>
        </Popconfirm>
      }
    </>
  );
};

export default Actions;
