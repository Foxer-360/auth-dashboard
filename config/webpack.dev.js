const fs = require('fs');
const path = require('path');
const Visualizer = require('webpack-visualizer-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const webpack = require('webpack');
const stringifiedEnv = require('./env');

const appSrc = path.resolve(__dirname, '../src');
const entryFile = path.resolve(appSrc, 'index.tsx');
const outDir = path.resolve(__dirname, '../build');
const publicDir = path.resolve(__dirname, '../public');

const bundleVisualization = './statistics.html';

// Path to React and React DOM libs
let node_modules = path.resolve(__dirname, '../node_modules');
let react = path.resolve(node_modules, 'react/umd');
if (!fs.existsSync(react)) {
  // This package is maybe called as workspace, change node_modules
  node_modules = path.resolve(__dirname, '../../node_modules');
  react = path.resolve(node_modules, 'react/umd');
  if (!fs.existsSync(react)) {
    console.log('React package is not found!');
    process.exit(1);
  }
}
const react_dom = path.resolve(node_modules, 'react-dom/umd');

// Path to AntDesign
const antd = path.resolve(node_modules, 'antd/dist');
const moment = path.resolve(node_modules, 'moment/min');

// Check DASHBOARD_PORT in .env
let dashboardPort = Number(process.env.DASHBOARD_PORT);
if (isNaN(dashboardPort) || !dashboardPort) {
  console.log('Port for Dashboard was not set! Using default port 9000');
  dashboardPort = 9000;
}

// Check DASHBOARD_HOST in .env
let dashboardHost = process.env.DASHBOARD_HOST;
if (!dashboardHost || dashboardHost.length < 2) {
  console.log('Host for Dashboard was not set! Using default host localhost');
  dashboardHost = 'localhost';
}

module.exports = {
  entry: entryFile,
  output: {
    filename: 'bundle.js',
    path: outDir
  },
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    alias: {
      '@source': appSrc
    },
    extensions: [
      '.ts',
      '.tsx',
      '.js',
      '.json'
    ]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: require.resolve('ts-loader') },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: require.resolve('source-map-loader'),
        exclude: [/node_modules/]
      },
      // Load all CSS files
      {
        test: /\.css$/,
        use: [
          ExtractCssChunks.loader,
          'css-loader'
        ]
      },
      // Load all SASS files
      {
        test: /\.scss$/,
        use: [
          ExtractCssChunks.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new ExtractCssChunks({
      filename: 'bundle.css',
      hot: true
    }),
    new Visualizer({
      filename: bundleVisualization
    }),
    // Make some environment variables available to the JS code, for example
    // variable process.env.AUTH0_CLIENT_ID
    new webpack.DefinePlugin(stringifiedEnv),
  ],
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'moment': 'moment',
    'antd': 'antd',
  },
  devServer: {
    allowedHosts: [
      'auth.foxer360.com',
      'localhost'
    ],
    contentBase: [
      publicDir,
      react,
      react_dom,
      moment,
      antd
    ],
    compress: true,
    port: dashboardPort,
    host: dashboardHost,
    hot: true,
    https: false,
    open: true,
    noInfo: false,
    inline: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    historyApiFallback: true
  }
};
