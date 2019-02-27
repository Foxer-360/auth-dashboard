import * as Errors from './errors';

const checkEnvironmentVariable = (name: string): boolean => {
  name = name.toUpperCase();

  if (!process.env[name] || process.env[name] === undefined || process.env[name] === null) {
    // tslint:disable-next-line:no-console
    console.error(`You need to specify %c${name}%c in environment!`, 'font-weight: bold', 'font-weight: normal');
    throw new Errors.IncorrectEnvironmentError(name);
    return false;
  }

  if ((process.env[name] as string).length < 1) {
    // tslint:disable-next-line:no-console
    console.error(`Environment variable %c${name}%c is defined, but its empty!`, 'font-weight: bold', 'font-weight: normal');
    throw new Errors.IncorrectEnvironmentError(name);
    return false;
  }

  return true;
}

const readEnvironmentVariable = (name: string): string => {
  name = name.toUpperCase();
  checkEnvironmentVariable(name);

  return process.env[name] as string;
};

export {
  checkEnvironmentVariable,
  Errors,
  readEnvironmentVariable,
};
