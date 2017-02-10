var path = require('path');

module.exports = {
  entry: './src/exms.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'exms.bundle.js',
    library: 'EXMS',
    libraryTarget: 'umd'
  },
  watch: true,
  module: {
    rules: [
      {test: /\.(js|jsx)$/, use: 'babel-loader'}
    ]
  }
};