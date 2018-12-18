const spawn = require('child_process').spawn;
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const port = process.env.PORT || 1212;
const publicPath = `http://localhost:${port}/dist`;
const OUTPUT_DIR = path.resolve(__dirname, 'dist')
const SRC_DIR = path.resolve(__dirname, 'src')
const defaultInclude = [SRC_DIR]

const baseConfig = {
  mode: 'development',
  output: {
    publicPath: '/',
    filename: '[name].js',
    path: OUTPUT_DIR
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'babel-loader',
        include: defaultInclude
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
}

const rendererConfig = Object.assign({}, baseConfig, {
    name: 'renderer',
    entry: [
        // 'react-hot-loader/patch',
        // `webpack-dev-server/client?http://localhost:${port}/`,
        // 'webpack/hot/only-dev-server',
        // require.resolve('../src/index')
         SRC_DIR + '/index.ts'
    ],
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html'
      })
    ],
    target: 'electron-renderer',
    devServer: {
        contentBase: OUTPUT_DIR,
        stats: {
          colors: true,
          chunks: false,
          children: false
        },
        before() {
            console.log('Starting Main Process...');
            spawn('npm', ['run', 'start'], {
              shell: true,
              env: process.env,
              stdio: 'inherit'
            })
              .on('close', code => process.exit(code))
              .on('error', spawnError => console.error(spawnError));
        }
      }
});

const mainConfig = Object.assign({}, baseConfig, {
    name: 'main',
    entry: SRC_DIR + '/main.ts',
    target: 'electron-main'
});

const config = [mainConfig, rendererConfig];

module.exports = config;
