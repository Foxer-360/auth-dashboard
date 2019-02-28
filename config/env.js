const fs = require('fs');
const path = require('path');
const { config } = require('dotenv');

// Define paths
const dashboard = path.resolve(__dirname, '..');
const masterRepo = path.resolve(dashboard, '..');
const dashboardEnv = path.resolve(dashboard, '.env');
const masterRepoEnv = path.resolve(masterRepo, '.env');

// Enabled env variables
const enabled = [
  'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_DOMAIN', 'AUTH0_REDIRECT', 'AUTH0_AUDIENCE',
  'GRAPHQL_SERVER_HOST', 'GRAPHQL_SERVER_PORT', 'GRAPHQL_SERVER_PATH',
  'GRAPHQL_SUBSCRIPTIONS_HOST', 'GRAPHQL_SUBSCRIPTIONS_PORT', 'GRAPHQL_SUBSCRIPTIONS_PATH'
];

// Check if .env file exists and load it, or fail
if (fs.existsSync(masterRepoEnv)) {
  config({
    path: masterRepoEnv
  });
} else if (fs.existsSync(dashboardEnv)) {
  config({
    path: dashboardEnv
  });
} else {
  console.error('Dashboard has no .env file. Please check, that you have it in correct place!');
  process.exit(1);
}

const envForClient = Object.keys(process.env)
  .filter((key) => enabled.includes(key))
  .reduce((
    (env, key) => {
      env[key] = process.env[key];
      return env;
    }
  ), {
    NODE_ENV: 'development',
  });

// Stringify all values so we can feed into Webpack DefinePlugin
const stringified = {
  'process.env': Object.keys(envForClient).reduce((
    (env, key) => {
      env[key] = JSON.stringify(envForClient[key]);
      return env;
    }
  ), {}),
};

module.exports = stringified;
