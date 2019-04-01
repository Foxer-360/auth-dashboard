import { Alert, Button, Spin } from 'antd';
import gql from 'graphql-tag';
import * as React from 'react';
import { useMutation, useQuery } from 'react-apollo-hooks';

import history from '@source/services/history';
import Form from './components/Form';


export interface IProperties {
  location: {
    pathname: string;
  };
}


const CLIENT_QUERY = gql`
  query($id: ID!) {
    client(
      where: {
        id: $id
      }
    ) {
      id
      name
      secret
    }
  }
`;

const CREATE_CLIENT = gql`
  mutation ($name: String!, $secret: String) {
    createClient(
      data: {
        name: $name
        secret: $secret
      }
    ) {
      id
      name
      secret
      projects { id }
      websites { id }
    }
  }
`;

const UPDATE_CLIENT = gql`
  mutation ($id: ID!, $name: String, $secret: String) {
    updateClient(
      where: {
        id: $id
      }
      data: {
        name: $name
        secret: $secret
      }
    ) {
      id
      name
      secret
      projects { id }
      websites { id }
    }
  }
`;



const ClientDetail = (props: IProperties) => {
  const userIdRegex = /^.*client\/([a-zA-Z0-9]+)$/i;
  const match = userIdRegex.exec(props.location.pathname);

  let isNew = true;
  let id = '';
  if (match && match[1] && match[1].length > 2) {
    isNew = false;
    id = match[1];
  }

  const createClient = useMutation(CREATE_CLIENT, { update: (proxy, res) => {
    const clientList = proxy.readQuery({ query: gql`{ clients { id name } }` }) as { clients: any[] };
    if (!clientList || !clientList.clients) {
      clientList.clients = [];
    }

    proxy.writeQuery({
      data: { clients: [ ...clientList.clients, res ] },
      query: gql`{ clients { id name } }`,
    });
  }});

  const updateClient = useMutation(UPDATE_CLIENT, { update: (proxy, res) => {
    proxy.writeQuery({
      data: res,
      query: CLIENT_QUERY,
      variables: { id },
    });
  } });

  const handleSave = (formData: any, create: boolean) => {
    // asdf
    if (create) {
      createClient({ variables: { ...formData } })
      .then(() => {
        history.push('/clients');
      });
    } else {
      updateClient({ variables: { ...formData, id }})
      .then(() => {
        history.push('/clients');
      });
    }
  };

  const handleCancel = () => {
    history.push('/clients');
  };

  if (isNew) {
    return (
      <div>
        <Form
          isNew={true}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      </div>
    );
  }

  const {data, errors, loading} = useQuery(CLIENT_QUERY, { variables: { id }});

  if (loading) {
    return (
      <Spin
        size="large"
        tip="Loading..."
      />
    );
  }

  if (errors) {
    return (
      <div>
        {errors.map((err, index) => (
          <Alert
            message="Error"
            description={err.message}
            type="error"
            showIcon={true}
            key={index}
          />
        ))}
        <div style={{ textAlign: 'center' }}>
          <Button style={{ marginTop: '24px' }} type="primary" onClick={handleCancel}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!data || !data.client) {
    return (
      <div>
        <Alert
          message="Error"
          description={'Client which you trying to edit doesnt exists!'}
          type="error"
          showIcon={true}
        />
        <div style={{ textAlign: 'center' }}>
          <Button style={{ marginTop: '24px' }} type="primary" onClick={handleCancel}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Form
        isNew={false}
        values={{
          id,
          name: data.client.name,
          secret: data.client.secret,
        }}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </div>
  );
};

export default ClientDetail;
