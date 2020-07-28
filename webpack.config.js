var webpack = require("webpack");
var path = require("path");
var fs = require("fs");

var nodeModules = {};
fs.readdirSync("node_modules")
  .filter(function (x) {
    return [".bin"].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = "commonjs " + mod;
  });

module.exports = {
  externals: nodeModules,
  entry: ["./src/nipkow-sdk/index.js"],
  target: "node",
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env",
            "@babel/react",
            {
              plugins: ["@babel/plugin-proposal-class-properties"],
            },
          ],
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  output: {
    path: __dirname,
    publicPath: "/",
    filename: "bundle.js",
    library: "Nipkow",
  },
  devServer: {
    historyApiFallback: true,
    contentBase: "./",
    port: 4172,
  },
};
