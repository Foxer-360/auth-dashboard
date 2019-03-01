import { Button } from 'antd';
import * as React from 'react';

import AuthUser from '@source/contexts/AuthUser';
import { logout } from '@source/services/auth0';
import Loading from './components/Loading';
import { useAuth0User } from './hooks';


export interface IProperties {
  children: React.ReactElement;
}

const AuthProvider = ({ children }: IProperties) => {
  const [loading, authUser, errors] = useAuth0User();

  if (errors) {
    const relogin = () => {
      logout();
    };

    return (
      <div style={{ textAlign: 'center', paddingTop: '12%' }}>
        <h1>Some errors occurred while the login process!</h1>
        <br /><br />
        <Button type="primary"onClick={relogin}>Re-Login</Button>
      </div>
    );
  }

  if (loading) {
    return <Loading count={4} />;
  }

  if (!authUser.isLogged) {
    return null;
  }

  // tslint:disable-next-line:no-console
  console.log('%c[AuthProvider]%c Rendering logged section...', 'color: green; font-weight: bold', 'font-weight: normal; color: green');

  return (
    <AuthUser.Provider value={authUser}>
      {children}
    </AuthUser.Provider>
  );
};

export default AuthProvider;
