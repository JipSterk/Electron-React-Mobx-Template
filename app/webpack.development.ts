import { Configuration, Entry, HotModuleReplacementPlugin } from "webpack";
import webpackMerge from "webpack-merge";
import { commonMainConfig, commonRenderConfig } from "./webpack.common";

const config: Configuration = {
  mode: "development",
  devtool: "source-map",
};

const developmentMainConfig = webpackMerge(config, commonMainConfig, {});

const developmentRenderConfig = webpackMerge(config, commonRenderConfig, {
  entry: {
    renderer: [
      "webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr",
      (commonRenderConfig.entry as Entry).renderer as string,
    ],
  },
  output: {
    publicPath: "http://localhost:3000/build/",
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader?sourceMap", "sass-loader?sourceMap"],
      },
    ],
  },
  plugins: [new HotModuleReplacementPlugin()],
});

export = [developmentMainConfig, developmentRenderConfig];
