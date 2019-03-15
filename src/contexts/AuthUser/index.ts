import { createContext } from 'react';

export interface IAuthUserProperties {
  auth0Id: string;
  avatar: string;
  isLogged: boolean;
  isSuperUser: boolean;
  name: string;
  userId: string;
}

export const defaultValues = {
  auth0Id: '',
  avatar: '',
  isLogged: false,
  isSuperUser: false,
  name: 'Undefined',
  userId: '',
} as IAuthUserProperties;

const AuthUser = createContext(defaultValues);

export default AuthUser;
