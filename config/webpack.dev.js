const path = require('path');
const Visualizer = require('webpack-visualizer-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

const appSrc = path.resolve(__dirname, '../src');
const entryFile = path.resolve(appSrc, 'index.tsx');
const outDir = path.resolve(__dirname, '../build');
const publicDir = path.resolve(__dirname, '../public');

const bundleVisualization = './statistics.html';

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
      { enforce: 'pre', test: /\.js$/, loader: require.resolve('source-map-loader') },
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
  ],
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
    hot: true,
    open: true,
    noInfo: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    historyApiFallback: true
  }
};
