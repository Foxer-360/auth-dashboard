import { Alert, Spin } from 'antd';
import gql from 'graphql-tag';
import * as React from 'react';
import { useQuery } from 'react-apollo-hooks';

import history from '@source/services/history';
import UserForm from './components/UserForm';


const USER_DETAIL = gql`
  query ($id: ID!) {
    user (
      where: { id: $id }
    ) {
      id
      name
      auth0Id
      avatar
      email

      clients { id }
      owns { id }
      enabledProjects { id }
      enabledWebsites { id }

      superuser
    }
  }
`;

export interface IProperties {
  location: {
    pathname: string;
  };
}


const UserDetail = (props: IProperties) => {
  const userIdRegex = /^.*user\/([a-zA-Z0-9]+)$/i;
  const match = userIdRegex.exec(props.location.pathname);

  const handleCancel = () => {
    history.push('/users');
  };

  // Check for new users
  if (!match || !match[1]) {
    // New User
    return (
      <UserForm
        isNew={true}
        disabled={false}
        onCancel={handleCancel}
      />
    );
  }

  const { data, errors, loading } = useQuery(USER_DETAIL, { variables: { id: match[1] } });

  if (loading) {
    return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (errors) {
    return (
      <Alert
        message="There was some network error while downloading user data!"
        type="error"
        showIcon={true}
      />
    );
  }

  // Transform data into values
  const { user } = data;
  const values = {
    auth0Id: user.auth0Id,
    avatar: user.avatar,
    clients: user.clients.map((c: any) => c.id),
    email: user.email,
    id: user.id,
    isSuperuser: user.superuser,
    name: user.name,
    owns: user.owns.map((o: any) => o.id),
    projects: user.enabledProjects.map((p: any) => p.id),
    websites: user.enabledWebsites.map((w: any) => w.id),
  };

  return (
    <UserForm
      isNew={false}
      values={values}
      disabled={false}
      onCancel={handleCancel}
    />
  );
};

export default UserDetail;
