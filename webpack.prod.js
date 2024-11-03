const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require("path"); // Import path module to resolve paths

process.env["NODE_ENV"] = "production";

module.exports = merge([
  common,
  {
    mode: "production",
    output: {
      filename: "app.js", 
      path: path.resolve(__dirname, "build"), 
    },
    optimization: {
      minimize: true,
      minimizer: [
      
        new CssMinimizerPlugin(),
      ],
    },
  },
]);
