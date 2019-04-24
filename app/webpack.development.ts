import * as webpack from "webpack";
import * as webpackMerge from "webpack-merge";
import * as common from "./webpack.common";

const config: webpack.Configuration = {
  mode: "development",
  devtool: "source-map"
};

const developmentMainConfig: webpack.Configuration = webpackMerge(
  config,
  common.commonMainConfig,
  {}
);

const developmentRenderConfig: webpack.Configuration = webpackMerge(
  config,
  common.commonRenderConfig,
  {
    entry: {
      renderer: [
        "webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr?reload=true",
        (common.commonRenderConfig.entry as webpack.Entry).renderer as string
      ]
    },
    output: {
      publicPath: "http://localhost:3000/build/"
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader?sourceMap", "sass-loader?sourceMap"]
        }
      ]
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
  }
);

export = [developmentMainConfig, developmentRenderConfig];
