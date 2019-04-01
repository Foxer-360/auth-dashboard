import { Alert, Spin } from 'antd';
import gql from 'graphql-tag';
import * as React from 'react';
import { useMutation, useQuery } from 'react-apollo-hooks';

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

const CREATE_MUTATION = gql`
  mutation ($avatar: String, $email: String! $name: String!,
    $password: String!, $superuser: Boolean, $clients: [ID!],
    $enabledProjects: [ID!], $enabledWebsites: [ID!] $owns: [ID!]) {
    createUser(
      data: {
        avatar: $avatar
        email: $email
        name: $name
        password: $password
        superuser: $superuser
        clients: $clients
        enabledProjects: $enabledProjects
        enabledWebsites: $enabledWebsites
        owns: $owns
        roles: []
      }
    ) {
      id
      name
    }
  }
`;

const UPDATE_MUTATION = gql`
  mutation ($id: ID!, $avatar: String, $name: String, $superuser: Boolean
    $clients: [ID!], $enabledProjects: [ID!], $enabledWebsites: [ID!]
    $owns: [ID!]) {
    updateUser(
      where: {
        id: $id
      }
      data: {
        avatar: $avatar
        name: $name
        superuser: $superuser
        clients: $clients
        enabledProjects: $enabledProjects
        enabledWebsites: $enabledWebsites
        owns: $owns
        roles: []
      }
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

  const createMutation = useMutation(CREATE_MUTATION, { update: (proxy, res) => {
    const userList = proxy.readQuery({ query: gql`{ users { id name } }` }) as { users: any[] };
    if (!userList || !userList.users) {
      userList.users = [];
    }

    proxy.writeQuery({
      data: { users: [...userList.users, res] },
      query: gql`{ users { id name } }`,
    });
  } });
  const updateMutation = useMutation(UPDATE_MUTATION, { update: (proxy, res) => {
    if (!match || !match[1]) {
      // New user, do not update
      return;
    }

    proxy.writeQuery({
      data: res,
      query: USER_DETAIL,
      variables: { id: match[1] },
    });
  } });

  const handleCancel = () => {
    history.push('/users');
  };

  const handleSave = (formData: any, create: boolean) => {
    // Nothing to do now
    if (create) {
      createMutation({ variables: formData })
      .then(() => {
        history.push('/users');
      });
    } else {
      if (!match || !match[1]) {
        return;
      }
      updateMutation({ variables: { id: match[1], ...formData } })
      .then(() => {
        history.push('/users');
      });
    }
  }

  // Check for new users
  if (!match || !match[1]) {
    // New User
    return (
      <UserForm
        isNew={true}
        disabled={false}
        onCancel={handleCancel}
        onSave={handleSave}
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
      onSave={handleSave}
    />
  );
};

export default UserDetail;
