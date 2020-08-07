const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [ '@babel/polyfill', './src/index.js' ],
  output: {
    path: path.resolve(__dirname + '/dist'),
    filename: './index.js'
  },
  mode: 'development',
  watchOptions: {
    ignored: /node_modules/
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpg|tsv)$/,
        use: ['file-loader?name=./[name].[ext]']
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new HTMLPlugin({
      filename: './index.html',
      template: './src/index.html',
      inject: false
    })
  ]
};
