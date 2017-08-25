const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const devConfig = require('./webpack/dev');
const prodConfig = require('./webpack/prod');

require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const baseConfig = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './build/public/assets'),
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        include: path.join(__dirname, 'src'),
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules'),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify(process.env.API_URL),
      }
    }),
  ],
};

module.exports = isProduction ? merge(baseConfig, prodConfig) : merge(baseConfig, devConfig);
