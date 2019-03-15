import { Alert } from 'antd';
import * as React from 'react';


export interface IProperties {
  errors: Error[] | null;
}


const Errors = ({ errors }: IProperties) => {
  if (!errors || errors.length < 1) {
    return null;
  }

  return (
    <div style={{ maxWidth: '720px', display: 'block', margin: '16px auto' }}>
      {errors.map((err: Error, index: number) => (
        <Alert
          closable={true}
          message="Network Error"
          type="error"
          showIcon={true}
          description={err.message}
          style={{ marginBottom: '16px' }}
          key={index}
        />
      ))}
    </div>
  );
};

export default Errors;
