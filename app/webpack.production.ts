import MiniCSSExtractPlugin, { loader } from "mini-css-extract-plugin";
import { Configuration } from "webpack";
import webpackMerge from "webpack-merge";
import { commonMainConfig, commonRenderConfig } from "./webpack.common";

const config: Configuration = {
  mode: "production",
  devtool: "source-map",
};

const productionMainConfig = webpackMerge(config, commonMainConfig, {});

const productionRenderConfig = webpackMerge(config, commonRenderConfig, {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new MiniCSSExtractPlugin({
      filename: "[name].css",
    }),
  ],
});

export = [productionMainConfig, productionRenderConfig];
