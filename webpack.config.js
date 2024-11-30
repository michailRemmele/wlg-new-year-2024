const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: 'none',

  entry: {
    app: path.resolve(__dirname, 'src/index.ts'),
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[fullhash].js',
  },

  devServer: {
    open: true,
    static: [
      path.join(__dirname, 'public'),
      path.join(__dirname, 'data/assets'),
    ],
  },

  devtool: isDev ? 'eval' : false,

  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    isDev ? null : new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'public/index.html'),
      chunks: ['app'],
    }),
    isDev ? null : new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'public'),
          globOptions: {
            ignore: [path.resolve(__dirname, 'public/index.html')],
          },
        },
        fs.existsSync(path.join(__dirname, 'data/assets')) && fs.readdirSync(path.join(__dirname, 'data/assets')).length ? {
          from: path.join(__dirname, 'data/assets'),
        } : null,
      ].filter(Boolean),
    }),
  ].filter(Boolean),

  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
};
