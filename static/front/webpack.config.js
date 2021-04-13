const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'index.js'),
  output: {
    path: __dirname,
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node-modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },

    ]
  }
}