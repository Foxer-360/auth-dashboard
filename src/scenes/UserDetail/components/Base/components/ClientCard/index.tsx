import {
  Alert,
  Button,
  Checkbox,
  Col,
  Popconfirm,
  Radio,
  Row,
  Tag
} from 'antd';
import * as React from 'react';
import { useContext, useState } from 'react';


import AuthUser from '@source/contexts/AuthUser';
import { useClient } from './hooks';

export interface IWebsiteDetail {
  name: string;
  id: string;
  enabled: boolean;
}

export interface IProjectDetail {
  name: string;
  id: string;
  enabled: boolean;
  websites: IWebsiteDetail[];
  disabled?: boolean;

  onChange?: (id: string, value: boolean) => void;
  onWebsiteChange?: (id: string, value: boolean) => void;
}

export interface IProperties {
  id: string;
  isOwner: boolean;
  projects: string[];
  websites: string[];

  onChange?: (id: string, property: string, value: any) => void;
}

export interface IProjectListProperties {
  isOwner: boolean;
  projects: IProjectDetail[];
  disabled?: boolean;

  onProjectChange?: (id: string, value: boolean) => void;
  onWebsiteChange?: (id: string, value: boolean) => void;
}

export interface IWebsiteListProperties {
  isProjectEnabled: boolean;
  websites: IWebsiteDetail[];
  disabled?: boolean;

  onChange?: (id: string, value: boolean) => void;
}


const WebsiteList = ({ isProjectEnabled, websites, onChange, disabled }: IWebsiteListProperties) => {
  if (!isProjectEnabled) {
    return (
      <Alert
        message="Whole project is disabled! No website in this project can be enabled for now."
        type="info"
        showIcon={true}
        style={{ margin: '0xp 24px' }}
      />
    );
  }

  if (websites.length < 1) {
    return (
      <Alert
        message="This project has no websites yet!"
        type="info"
        showIcon={true}
        style={{ margin: '0xp 24px' }}
      />
    );
  }

  const handleChange = (id: string, state: boolean) => () => {
    if (onChange) {
      onChange(id, !state);
    }
  };

  if (disabled) {
    return (
      <>
        {websites.map((website: IWebsiteDetail, index: number) => (
          <Tag
            key={index}
            color={website.enabled ? 'blue' : 'grey'}
          >
            {website.name}
          </Tag>
        ))}
      </>
    );
  }

  return (
    <>
      {websites.map((website: IWebsiteDetail, index: number) => (
        <Tag
          key={index}
          color={website.enabled ? 'blue' : 'grey'}
          onClick={handleChange(website.id, website.enabled)}
        >
          {website.name}
        </Tag>
      ))}
    </>
  );
};

const ProjectDetail = ({ id, name, enabled, websites, onChange, onWebsiteChange, disabled }: IProjectDetail) => {
  const rowStyle = {
    borderTop: '1px dashed #eaeaea',
    margin: '12px 16px',
    paddingTop: '12px',
  } as React.CSSProperties;

  const handleChange = (e: any) => {
    if (onChange) {
      onChange(id, e.target.value);
    }
  };

  return (
    <Row gutter={8} style={rowStyle}>
      <Col span={8} style={{ textAlign: 'center' }}>
        <h3>{name}</h3>
        <div>
          <Radio.Group size="small" value={enabled} buttonStyle="solid" onChange={handleChange} disabled={disabled}>
            <Radio.Button value={true}>Enable</Radio.Button>
            <Radio.Button value={false}>Disable</Radio.Button>
          </Radio.Group>
        </div>
      </Col>
      <Col span={16}>
        <h4>Websites</h4>
        <WebsiteList
          isProjectEnabled={enabled}
          websites={websites}
          onChange={onWebsiteChange}
          disabled={disabled}
        />
      </Col>
    </Row>
  );
};

const ProjectList = ({ isOwner, projects, onProjectChange, onWebsiteChange, disabled }: IProjectListProperties) => {
  if (isOwner) {
    return (
      <Alert
        message="As owner you have access to all projects and websites."
        type="info"
        showIcon={true}
        style={{ margin: '12px 24px 0px 24px' }}
      />
    );
  }

  if (projects.length < 1) {
    return (
      <Alert
        message="This client has no projects yet!"
        type="info"
        showIcon={true}
        style={{ margin: '12px 24px 0px 24px' }}
      />
    );
  }

  return (
    <>
      {projects.map((project: IProjectDetail, index: number) => (
        <ProjectDetail
          key={index}
          {...project}
          onChange={onProjectChange}
          onWebsiteChange={onWebsiteChange}
          disabled={disabled}
        />
      ))}
    </>
  );
};


const ClientCard = ({ id, isOwner, projects, websites, onChange }: IProperties) => {
  const [detail, setDetail] = useState(false);
  const { client, errors, loading } = useClient(id, projects, websites);
  const { clients, isSuperUser, owns } = useContext(AuthUser);

  // Can read ?
  let iCanRead = isSuperUser;
  let iCanWrite = isSuperUser;

  if (!iCanRead) {
    const found = clients.find((c) => {
      if (c.id === id) {
        return true;
      }

      return false;
    });
    if (found) {
      iCanRead = true;
    }
  }

  if (!iCanWrite) {
    const found = owns.find((o) => {
      if (o.id === id) {
        return true;
      }

      return false;
    });
    if (found) {
      iCanWrite = true;
    }
  }

  if (errors) {
    return (<span>Error</span>);
  }

  if (loading) {
    return (<span>Loading...</span>);
  }

  if (!client) {
    return (<span>Error, data not loaded</span>);
  }

  const toggleDetail = () => {
    setDetail(!detail);
  }

  const handleProjectChange = (projectId: string, value: boolean) => {
    if (onChange) {
      if (value) {
        onChange(id, 'projects', { projects: [ ...projects, projectId ], websites });
      } else {
        // Remove also websites under this project
        let websiteIds = [] as string[];
        client.projects.find((project) => {
          if (project.id === projectId) {
            websiteIds = project.websites.map((web) => web.id);
            return true;
          }

          return false;
        });

        const res = {} as { websites: string[]; projects: string[] };
        res.websites = websites.filter((web) => !websiteIds.includes(web));
        res.projects = projects.filter((project) => projectId !== project);

        onChange(id, 'projects', res);
      }
    }
  };

  const handleWebsiteChange = (websiteId: string, value: boolean) => {
    if (onChange) {
      if (value) {
        onChange(id, 'websites', [ ...websites, websiteId ]);
      } else {
        onChange(id, 'websites', websites.filter((web) => web !== websiteId));
      }
    }
  };

  const removeAllProjectsAndWebsites = () => {
    if (!onChange) {
      return;
    }

    // Remove all projects and websites under this client
    let websiteIds = [ ...websites ];
    let projectIds = [ ...projects ];

    client.projects.forEach((p) => {
      projectIds = projectIds.filter((v) => v !== p.id);
      p.websites.forEach((w) => {
        websiteIds = websiteIds.filter((v) => v !== w.id);
      });
    });

    onChange(id, 'projects', { projects: projectIds, websites: websiteIds });
  };

  const handleOwnerChange = (e: any) => {
    if (onChange) {
      if (e.target.checked) {
        // Remove also projects and websites under this client
        removeAllProjectsAndWebsites();
      }
      onChange(id, 'isOwner', e.target.checked);
    }
  };

  const handleUnassign = () => {
    if (onChange) {
      removeAllProjectsAndWebsites();
      onChange(id, 'unassign', true);
    }
  };

  const cardStyle = {
    background: '#fdfdfd',
    border: '1px solid #eaeaea',
    borderRadius: '6px',
    margin: '8px 0px',
    padding: '10px 6px',
  } as React.CSSProperties;

  return (
    <div style={cardStyle}>
      <div>
        <span style={{ padding: 0, marginLeft: '12px', fontWeight: 'bold' }}>{client.name}</span>
        <div style={{ float: 'right' }}>
          <Checkbox checked={isOwner} onChange={handleOwnerChange} disabled={!iCanWrite}>Owner</Checkbox>
          <Button size="small" type="primary" icon="edit" style={{ marginRight: '6px' }} onClick={toggleDetail} disabled={!iCanRead}>Detail</Button>
          {iCanWrite ?
            <Popconfirm
              title="Are you sure to unassign from this client?"
              okText="Sure"
              cancelText="Keep"
              onConfirm={handleUnassign}
            >
              <Button size="small" type="danger" icon="delete">Unassign</Button>
            </Popconfirm>
            :
            <Button size="small" type="danger" icon="delete" disabled={true}>Unassign</Button>
          }
        </div>
      </div>

      {detail ?
        <div style={{ paddingTop: '4px' }}>
          <ProjectList
            isOwner={isOwner}
            projects={client.projects}

            onProjectChange={handleProjectChange}
            onWebsiteChange={handleWebsiteChange}

            disabled={!iCanWrite}
          />
        </div>
        :
        null
      }
    </div>
  );
};

export default ClientCard;
