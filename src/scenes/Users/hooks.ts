import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';


const USERS_QUERY = gql`{
  users {
    auth0Id
    avatar
    clients {
      id
      name
    }
    email
    id
    name
  }
}`;


export interface IClient {
  id: string;
  name: string;
}

export interface IUserRecord {
  auth0Id: string;
  avatar: string;
  clients: IClient[];
  email: string;
  id: string;
  name: string;
}


const useUsers = () => {
  const { data, errors, loading } = useQuery(USERS_QUERY);

  if (!data || !data.users) {
    return [[], errors, loading];
  }

  const mapped = data.users.map((rec: IUserRecord) => ({ ...rec, key: rec.id }));
  return [mapped, errors, loading];
};

export {
  useUsers,
};
