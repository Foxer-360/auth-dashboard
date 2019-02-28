import * as React from 'react';

import AuthUser from '@source/contexts/AuthUser';
import Loading from './components/Loading';
import { useAuth0User } from './hooks';


export interface IProperties {
  children: React.ReactElement;
}

const AuthProvider = ({ children }: IProperties) => {
  const [loading, authUser] = useAuth0User();

  if (loading) {
    return <Loading count={4} />;
  }

  if (!authUser.isLogged) {
    return null;
  }

  return (
    <AuthUser.Provider value={authUser}>
      {children}
    </AuthUser.Provider>
  );
};

export default AuthProvider;
