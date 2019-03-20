import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

import { IProjectDetail, IWebsiteDetail } from './index';

const CLIENT_QUERY = gql`
  query ($id: ID!) {
    client(
      where: { id: $id }
    ) {
      id
      name
      projects {
        id
        name
        websites {
          id
          name
        }
      }
    }
  }
`;

interface IQueryWebsite {
  id: string;
  name: string;
}

interface IQueryProject {
  id: string;
  name: string;
  websites: IQueryWebsite[];
}

interface IClient {
  id: string;
  name: string;
  projects: IProjectDetail[];
}

const mapWebsites = (websites: IQueryWebsite[], enabledIds: string[]): IWebsiteDetail[] => {
  return websites.map((web) => ({
    ...web,
    enabled: enabledIds.includes(web.id),
  } as IWebsiteDetail));
};

const mapProjects = (projects: IQueryProject[], enabledProjects: string[], enabledWebsites: string[]): IProjectDetail[] => {
  return projects.map((project) => ({
    enabled: enabledProjects.includes(project.id),
    id: project.id,
    name: project.name,
    websites: mapWebsites(project.websites, enabledWebsites),
  } as IProjectDetail));
};

const useClient = (id: string, projects: string[], websites: string[]) => {
  const { data, errors, loading } = useQuery(CLIENT_QUERY, { variables: { id } });
  let client = null as IClient | null;

  if (data && data.client) {
    // Prepare data
    client = {
      id: data.client.id,
      name: data.client.name,
      projects: mapProjects(data.client.projects, projects, websites),
    };
  }

  return { client, errors, loading };
};

export {
  useClient
};
