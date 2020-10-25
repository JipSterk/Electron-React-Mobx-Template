import MiniCSSExtractPlugin, { loader } from "mini-css-extract-plugin";
import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import { commonMainConfig, commonRenderConfig } from "./webpack.common";

const config: Configuration = {
  mode: "production",
  devtool: "source-map",
};

const mainConfig = merge(config, commonMainConfig, {});

const rendererConfig = merge(config, commonRenderConfig, {
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new MiniCSSExtractPlugin({
      filename: "renderer.css",
    }),
  ],
});

export default [mainConfig, rendererConfig];
