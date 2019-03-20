import { createContext } from 'react';

export interface IAuthUserProperties {
  auth0Id: string;
  avatar: string;
  isLogged: boolean;
  isSuperUser: boolean;
  name: string;
  userId: string;
  clients: Array<{
    id: string;
    name: string;
  }>;
  owns: Array<{
    id: string;
    name: string;
  }>;
}

export const defaultValues = {
  auth0Id: '',
  avatar: '',
  clients: [],
  isLogged: false,
  isSuperUser: false,
  name: 'Undefined',
  owns: [],
  userId: '',
} as IAuthUserProperties;

const AuthUser = createContext(defaultValues);

export default AuthUser;
