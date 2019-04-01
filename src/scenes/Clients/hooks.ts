import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';


const CLIENTS_QUERY = gql`{
  clients {
    id
    name
    projects {
      id
    }
    websites {
      id
    }
  }
}`;

interface IClientRecord {
  id: string;
  name: string;
  projects: Array<{ id: string }>;
  websites: Array<{ id: string }>;
}

interface IDataRecord {
  id: string;
  name: string;
  projects: number;
  websites: number;
}

type HookGraphQLError = ReadonlyArray<GraphQLError> | undefined;
type UseClientHook = [IDataRecord[], HookGraphQLError, boolean];

const useClients = (): UseClientHook => {
  const { data, errors, loading } = useQuery(CLIENTS_QUERY);

  if (!data || !data.clients) {
    return [[] as IDataRecord[], errors, loading];
  }

  const mapped = data.clients.map((rec: IClientRecord) => ({
    id: rec.id,
    key: rec.id,
    name: rec.name,
    projects: rec.projects.length,
    websites: rec.websites.length,
  })) as IDataRecord[];
  return [mapped, errors, loading];
};

export {
  useClients,
};
