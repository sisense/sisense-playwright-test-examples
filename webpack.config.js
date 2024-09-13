const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const GlobEntries = require("webpack-glob-entries");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: GlobEntries("./tests-k6/**/*.test.ts"), // Generates multiple entry for each test
  output: {
    path: path.join(__dirname, "dist", "tests-k6"),
    libraryTarget: "commonjs",
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@config": path.resolve(__dirname, "src", "config"),
      "@constants": path.resolve(__dirname, "src", "constants"),
      "@controllers": path.resolve(__dirname, "src", "api", "controllers"),
      "@models": path.resolve(__dirname, "src", "api", "models"),
      "@pages": path.resolve(__dirname, "src", "pages"),
      "@utils": path.resolve(__dirname, "src", "utils"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.png$/,
        type: "asset/resource",
      },
      {
        test: /\.html$/,
        type: "asset/resource",
      },
      {
        test: /\.css$/,
        type: "asset/resource",
      },
      {
        loader: "string-replace-loader",
        options: {
          search: "process.env.",
          replace: "__ENV.",
          flags: "g",
        },
      },
    ],
  },
  target: "web",
  externals: [
    // /^(k6|https?:\/\/)(\/.*)?/,
    function ({ context, request }, c) {
      if (request.startsWith("k6") || request.startsWith("https://")) {
        return request === "k6-junit" ? c() : c(null, "commonjs " + request);
      }
      return c();
    },
  ],
  // Generate map files for compiled scripts
  devtool: "source-map",
  stats: {
    colors: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    // Copy assets to the destination folder
    // see `src/post-file-test.ts` for test example using an asset
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "assets"),
          noErrorOnMissing: true,
        },
      ],
    }),
    // fix "process is not defined" error:
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
  optimization: {
    // Don't minimize, as it's not used in the browser
    minimize: false,
  },
};
