import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration } from "webpack";
import { merge } from "webpack-merge";

const outputDir: string = "out";
export const externals: string[] = ["7zip"];

if (process.env.NODE_ENV === "development") {
  externals.push("devtron");
}

const commonConfig: Configuration = {
  externals,
  output: {
    path: path.resolve(__dirname, "..", outputDir),
    filename: "[name].js",
    libraryTarget: "commonjs2",
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
              useCache: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [outputDir],
      verbose: false,
    }),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
};

export const commonMainConfig = merge(commonConfig, {
  target: "electron-main",
  entry: {
    main: path.resolve(__dirname, "src/main-process/main"),
  },
});

export const commonRenderConfig = merge(commonConfig, {
  target: "electron-renderer",
  entry: {
    renderer: path.resolve(__dirname, "src/ui/index"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "static", "index.html"),
    }),
  ],
});
