import MiniCSSExtractPlugin, { loader } from "mini-css-extract-plugin";
import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import { commonMainConfig, commonRenderConfig } from "./webpack.common";

const config: Configuration = {
  mode: "production",
  devtool: "source-map",
};

const productionMainConfig = merge(config, commonMainConfig, {});

const productionRenderConfig = merge(config, commonRenderConfig, {
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
