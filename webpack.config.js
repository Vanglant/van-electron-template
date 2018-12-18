const spawn = require('child_process').spawn;
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('react-hot-loader/patch');

const port = process.env.PORT || 1212;
const OUTPUT_DIR = path.resolve(__dirname, 'dist');
const SRC_DIR = path.resolve(__dirname, 'src');
const defaultInclude = [SRC_DIR];

const baseConfig = {
  mode: 'development',
  output: {
    publicPath: '/',
    filename: '[name].js',
    path: OUTPUT_DIR,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
        include: defaultInclude,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
};

const rendererConfig = Object.assign({}, baseConfig, {
  name: 'renderer',
  entry: [
    '@babel/polyfill',
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    SRC_DIR + '/index.tsx',
  ],
  target: 'electron-renderer',
  devtool: 'source-map',
  devServer: {
    publicPath: '/',
    contentBase: OUTPUT_DIR,
    stats: {
      colors: true,
      chunks: false,
      children: false,
    },
    hot: true,
    before() {
      console.log('Starting Main Process...');
      spawn('npm', ['run', 'start'], {
        shell: true,
        env: process.env,
        stdio: 'inherit',
      })
        .on('close', code => process.exit(code))
        .on('error', spawnError => console.error(spawnError));
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
});

const mainConfig = Object.assign({}, baseConfig, {
  name: 'main',
  entry: SRC_DIR + '/main.ts',
  target: 'electron-main',
});

const config = [mainConfig, rendererConfig];

module.exports = config;
