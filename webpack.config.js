const path = require("path");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: ["./src/main.js"],
  module: {
    rules: [
      {
        use: "babel-loader",
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
  },
  devServer: {
    contentBase: path.join(__dirname, "src/"),
    publicPath: "http://localhost:3000/dist/",
    historyApiFallback: true,
    port: 3000,
  },
};
