import { Button, Input, Row } from 'antd';
import * as React from 'react';
import { useEffect, useState } from 'react';


export interface IProperties {
  isNew: boolean;
  values?: {
    id: string;
    name: string;
    secret: string;
  };

  onCancel?: () => void;
  onSave?: (data: any, create: boolean) => void;
}

export interface IState {
  touched: boolean;
  name: string;
  secret: string;
}

const defaultValues = {
  name: '',
  secret: '',
  touched: false,
} as IState;

const generateRandomString = (len: number):string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvqxyz0987654321_-:';
  let res = '';

  for (let i = 0;i < len;i++) {
    const index = Math.round(Math.random() * (charset.length - 1));
    res += charset[index];
  }

  return res;
};

const Form = (props: IProperties) => {
  const [state, setState] = useState<IState>(defaultValues);

  useEffect(() => {
    // Copy props into state
    if (!state.touched && !props.isNew) {
      if (!props.values) { return; }

      setState({
        ...props.values,
        touched: true,
      });
    }
  });

  const handleGenerateSecret = () => {
    const secret = generateRandomString(64);
    setState(old => ({
      ...old,
      secret,
      touched: true,
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();

    setState(old => ({
      ...old,
      name: e.target.value,
      touched: true,
    }));
  };

  const handleAction = (name: string) => () => {
    if (name === 'save' && props.onSave) {
      const data = {
        name: state.name,
        secret: state.secret
      };
      props.onSave(data, props.isNew);
      return;
    }

    if (name === 'cancel' && props.onCancel) {
      props.onCancel();
      return;
    }
  };

  const rowStyle = {
    marginBottom: '16px',
  } as React.CSSProperties;

  const containerStyle = {
    margin: '12px auto',
    maxWidth: '720px',
  } as React.CSSProperties;

  return (
    <>
      <div style={containerStyle}>
        {!props.isNew ?
          <Row style={rowStyle}>
            <label>Client ID</label>
            <Input disabled={true} value={props.values ? props.values.id : ''} />
          </Row>
          :
          null
        }
        <Row style={rowStyle}>
          <label>Name</label>
          <Input onChange={handleNameChange} value={state.name} />
        </Row>
        <Row style={rowStyle}>
          <label>Secret</label>
          <div style={{ display: 'flex' }}>
            <Input style={{ width: '100%', marginRight: '6px' }} disabled={true} value={state.secret} />
            <Button type="primary" onClick={handleGenerateSecret}>Generate</Button>
          </div>
        </Row>
      </div>
      <Row>
        <div style={{ width: '100% !important', float: 'right', marginRight: '60px' }}>
          <Button type="primary" onClick={handleAction('save')}>{props.isNew ? 'Create' : 'Save'}</Button>
          <Button style={{ marginLeft: '12px' }} onClick={handleAction('cancel')}>Cancel</Button>
        </div>
      </Row>
    </>
  );
};

export default Form;
