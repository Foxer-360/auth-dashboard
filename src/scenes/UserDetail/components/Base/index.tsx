import { Alert, Col, Icon, Input, Radio, Row } from 'antd';
import * as React from 'react';
import { useContext } from 'react';

import AuthUser from '@source/contexts/AuthUser';
import AssignClient from './components/AssignClient';
import ClientCard from './components/ClientCard';


export interface IProperties {
  id?: string;
  auth0Id?: string;
  name: string;
  email: string;
  avatar?: string;
  isSuperuser?: boolean;
  projects: string[];
  websites: string[];
  owns: string[];
  clients: string[];
  password?: string | null;

  onChange?: (property: string, value: any) => void;
  isEmailDisabled?: boolean;
  disabled?: boolean;
}


const Base = (props: IProperties) => {
  const { isSuperUser } = useContext(AuthUser);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange('name', e.target.value);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange('email', e.target.value);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange('avatar', e.target.value);
    }
  };

  const handleSuperUserChange = (e: any) => {
    if (props.onChange) {
      props.onChange('isSuperuser', e.target.value);
    }
  };

  const handleAssignClient = (id: string) => {
    if (props.onChange) {
      props.onChange('clients', [ ...props.clients, id ]);
    }
  };

  const handleClientCardChange = (clientId: string, property: string, value: any) => {
    // Check if we have onChange method in props, otherwise skip whole function
    if (!props.onChange) {
      return;
    }

    if (property === 'websites') {
      props.onChange('websites', value);
      return;
    }
    if (property === 'projects') {
      props.onChange('websites', value.websites);
      props.onChange('projects', value.projects);
      return;
    }
    if (property === 'isOwner') {
      if (value) {
        props.onChange('owns', [ ...props.owns, clientId ]);
      } else {
        props.onChange('owns', props.owns.filter((own) => own !== clientId));
      }
      return;
    }
    if (property === 'unassign') {
      props.onChange('owns', props.owns.filter((own) => own !== clientId));
      props.onChange('clients', props.clients.filter((client) => client !== clientId));
      return;
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange('password', e.target.value);
    }
  }

  const formRowStyle = {
    marginBottom: '12px',
  } as React.CSSProperties;

  let disabled = false;
  if (props.disabled) {
    disabled = true;
  }

  let disabledEmail = false;
  if (disabled || props.isEmailDisabled) {
    disabledEmail = true;
  }

  let auth0Id = 'It will be assigned...';
  if (props.auth0Id && props.auth0Id.length > 1) {
    auth0Id = props.auth0Id;
  }

  let avatar = 'https://www.w3schools.com/w3images/avatar2.png';
  if (props.avatar && props.avatar.length > 2) {
    avatar = props.avatar;
  }

  return (
    <div style={{ display: 'flex', width: 'auto', margin: '0px 16px' }}>
      <div style={{ marginRight: '18px', width: '120px' }}>
        <img
          src={avatar}
          style={{
            background: 'black',
            borderRadius: '6px',
            height: '120px',
            width: '120px',
          }}
        />
      </div>
    <div style={{ width: '100%' }}>
    <Row gutter={16}>

      <Col span={8}>
        <Row style={formRowStyle}>
          <label>Name</label>
          <Input disabled={disabled} onChange={handleNameChange} value={props.name} />
        </Row>
        <Row style={formRowStyle}>
          <label>Email</label>
          <Input onChange={handleEmailChange} disabled={disabledEmail} value={props.email} />
        </Row>
        {props.password !== null ?
          <Row style={formRowStyle}>
            <label>Password</label>
            <Input.Password onChange={handlePasswordChange} value={props.password} addonBefore={<Icon type="lock" />} />
          </Row>
          :
          null
        }
        <Row style={formRowStyle}>
          <label>Avatar</label>
          <Input disabled={disabled} onChange={handleAvatarChange} value={props.avatar} addonAfter="URL" />
        </Row>
        {isSuperUser ?
          <>
            <Row style={formRowStyle}>
              <label>Is SuperUser</label>
              <Radio.Group disabled={disabled} value={props.isSuperuser} buttonStyle="solid" style={{ marginLeft: '18px' }} onChange={handleSuperUserChange}>
                <Radio.Button value={false}>No</Radio.Button>
                <Radio.Button value={true}>Yes</Radio.Button>
              </Radio.Group>
            </Row>
            <Row style={formRowStyle}>
              <label>Auth0 ID</label>
              <Input disabled={true} value={auth0Id} />
            </Row>
          </>
          :
          null
        }
      </Col>

      <Col span={16}>
        <Row style={formRowStyle}>
          <label>Clients</label><br />
          {props.clients.length < 1 ?
            <Alert
              message="There are no assigned clients for this user..."
              type="info"
              showIcon={true}
              style={{ margin: '8px 16px' }}
            />
            :
            props.clients.map((clientId) => (
              <ClientCard
                id={clientId}
                isOwner={props.owns.includes(clientId)}
                projects={props.projects}
                websites={props.websites}
                onChange={handleClientCardChange}
                key={clientId}
              />
            ))
          }

          <AssignClient
            clients={props.clients}
            style={{ marginTop: '16px', maxWidth: '520px' }}
            disabled={disabled}
            onAssign={handleAssignClient}
          />
        </Row>
      </Col>
    </Row>
    </div>
    </div>
  );
};

export default Base;
