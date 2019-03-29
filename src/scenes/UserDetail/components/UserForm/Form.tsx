import { Button, Tabs } from 'antd';
import * as React from 'react';
import { useEffect, useState } from 'react';

import Base from '../Base';


export interface IProperties {
  isNew: boolean;
  values?: {
    avatar: string;
    auth0Id: string;
    email: string;
    isSuperuser: boolean;
    name: string;
    projects: string[];
    websites: string[];
    owns: string[];
    clients: string[];
  };
  disabled?: boolean;

  onCancel?: () => void;
}

interface IState {
  auth0Id: string;
  avatar: string;
  clients: string[];
  email: string;
  isSuperuser: boolean;
  name: string;
  owns: string[];
  password?: string;
  projects: string[];
  touched: boolean;
  websites: string[];
}


const defaultValues = {
  auth0Id: '',
  avatar: '',
  clients: [],
  email: '',
  isSuperuser: false,
  name: '',
  owns: [],
  password: '',
  projects: [],
  touched: false,
  websites: [],
} as IState;


const Form = (props: IProperties) => {
  const [state, setState] = useState(defaultValues);

  // tslint:disable-next-line:no-console
  console.log(`[UserForm] Rerendered... State was.. `, { ...state });

  useEffect(() => {
    // Copy props into state
    if (!state.touched && !props.isNew) {
      if (!props.values) { return; }
      // There is code for copy
      setState({
        ...props.values,
        touched: true,
      });
    }
  });

  const handleOnCancel = () => {
    if (props.onCancel) {
      props.onCancel();
    }
  };

  const handleBaseChange = (property: string, value: any) => {
    setState((oldState) => ({
      ...oldState,
      touched: true,
      [property]: value,
    }));
  };

  return (
    <div>
      <Tabs defaultActiveKey="base">
        <Tabs.TabPane tab="Basic Info" key="base">
          <Base
            auth0Id={state.auth0Id}
            name={state.name}
            email={state.email}
            avatar={state.avatar}
            onChange={handleBaseChange}
            isEmailDisabled={!props.isNew}
            disabled={props.disabled}
            isSuperuser={state.isSuperuser}
            projects={state.projects}
            websites={state.websites}
            owns={state.owns}
            clients={state.clients}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Rules" key="rules">Rules</Tabs.TabPane>
      </Tabs>
      <div style={{ marginTop: '24px', float: 'right', marginRight: '12px' }}>
        <Button type="primary" style={{ marginRight: '8px' }}>{props.isNew ? 'Create' : 'Save'}</Button>
        <Button type="default" onClick={handleOnCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default Form;
