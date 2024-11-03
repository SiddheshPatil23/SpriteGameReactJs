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
      filename: "app.js", // Name of the output file
      path: path.resolve(__dirname, "dist"), // Directory to write files
    },
    optimization: {
      minimize: true,
      minimizer: [
        // Uncomment the `...` to extend existing minimizers if needed
        // `...`,
        new CssMinimizerPlugin(),
      ],
    },
  },
]);
