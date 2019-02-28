import * as Errors from './errors';

/**
 * Check if environment variable is defined in .env file, if not throw error.
 *
 * @param {string} name of variable (can be lower case, automatically convert
 *                      to upper case)
 * @return {boolean}
 */
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

/**
 * Read environment variable defined in .env file. If it's not defined, throw
 * error.
 *
 * @param {string} naem of variable (can be lower case, automatically convert
 *                      to upper case)
 * @return {string} value
 */
const readEnvironmentVariable = (name: string): string => {
  name = name.toUpperCase();
  checkEnvironmentVariable(name);

  return process.env[name] as string;
};

/**
 * Build complete URL from variables specified in .env file. Names of this
 * variables are given as params of this function.
 *
 * @param {string} host name of env variable which specify host
 * @param {string} port name of env variable which specify port
 * @param {string} path name of env variable which specify path
 * @param {string} prefix? specify prefix of url like http ws or other,
 * default is http (do not use for example http://, just http)
 */
const buildUrlFromEnv = (host: string, port: string, path: string, prefix?: string) => {
  let result = '';

  let hostValue = readEnvironmentVariable(host);
  const portValue: string = readEnvironmentVariable(port);
  const pathValue = readEnvironmentVariable(path);

  hostValue = hostValue.replace(/\/$/gi, '');
  let hostRegex = RegExp(`^https?:\/\/.*`);
  if (prefix && prefix.length > 1) {
    hostRegex = RegExp(`^${prefix}:\/\/.*`);
  }

  // Check if host has http:// or https:// or prefix://
  if (!hostRegex.test(hostValue)) {
    if (!prefix || prefix.length < 2) {
      prefix = 'http';
    }
    // Setup default prefix
    hostValue = `${prefix}://${hostValue}`;
  }
  result = hostValue;

  const portNum = parseInt(portValue, 0);
  if (!isNaN(portNum) && portNum !== 80) {
    result = `${result}:${portNum}`;
  }

  if (pathValue.length > 1) {
    if (pathValue[0] !== '/') {
      result = `${result}/`;
    }

    result = `${result}${pathValue}`;
  }

  return result;
};


export {
  buildUrlFromEnv,
  checkEnvironmentVariable,
  Errors,
  readEnvironmentVariable,
};
