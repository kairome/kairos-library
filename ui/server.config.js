const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

require('dotenv').config();

module.exports = {
  entry: './src/server-rendering.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, './build/public/assets'),
    filename: '../../../lib/server-rendering.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true,
                localIdentName: '__[local]__[hash:base64:8]',
              },
            },
            'postcss-loader',
          ],
        }),
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve(`${__dirname}/src`),
      path.resolve(`${__dirname}/node_modules`),
    ],
  },
  plugins: [
    new ExtractTextPlugin('app.css'),
    new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify(process.env.API_URL),
      },
    }),
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
  ],
};
