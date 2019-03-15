import { Button, Popconfirm, Tooltip } from 'antd';
import * as React from 'react';
import { useContext } from 'react';

import AuthUser from '@source/contexts/AuthUser';
import history from '@source/services/history';

export interface IProperties {
  id: string;
}

const Actions = ({ id }: IProperties) => {
  const { userId } = useContext(AuthUser);

  // Check if it's current user
  let currentUser = false;
  if (userId === id) {
    currentUser = true;
  }

  const goToEditation = () => {
    history.push(`/user/${id}`);
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
