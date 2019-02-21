const path = require('path');

const appSrc = path.resolve(__dirname, '../src');
const entryFile = path.resolve(appSrc, 'index.tsx');
const outDir = path.resolve(__dirname, '../build');
const publicDir = path.resolve(__dirname, '../public');

// Path to React and React DOM libs
const node_modules = path.resolve(__dirname, '../node_modules');
const react = path.resolve(node_modules, 'react/umd');
const react_dom = path.resolve(node_modules, 'react-dom/umd');

// Path to AntDesign
const antd = path.resolve(node_modules, 'antd/dist');
const moment = path.resolve(node_modules, 'moment/min');

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
      { enforce: 'pre', test: /\.js$/, loader: require.resolve('source-map-loader') }
    ]
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'moment': 'moment',
    'antd': 'antd',
  },
  devServer: {
    contentBase: [
      publicDir,
      react,
      react_dom,
      moment,
      antd
    ],
    compress: true,
    port: 9000,
    hot: true
  }
};
