const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/lib/',
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /(node_modules)/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new UglifyJSPlugin()
  ]
};
