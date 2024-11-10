const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    static: './dist',
    proxy: [
        {
          context: ['/tickets'],
          target: 'http://localhost:5000',
        },
        {
          context: ['/ticket'],
          target: 'http://localhost:5000',
        },
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[hash].[ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
};