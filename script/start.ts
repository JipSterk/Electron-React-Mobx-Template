import express from "express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import configs from "../app/webpack.development";
import { run } from "./run";

function startApp(): void {
  const runningApp = run({ stdio: "inherit" });

  if (!runningApp) {
    console.log("Couldn't launch app. Try building it");
    process.exit(1);
    return;
  }

  runningApp.on("close", (): void => {
    process.exit(0);
  });
}

if (process.env.NODE_ENV === "production") {
  startApp();
} else {
  const developmentRenderConfig = configs[1];

  const server = express();
  const compiler = webpack(developmentRenderConfig);
  const port = Number.parseInt(process.env.PORT!) || 3000;

  server.use(
    webpackDevMiddleware(compiler, {
      publicPath: developmentRenderConfig!.output!.publicPath!,
    })
  );

  server.use(webpackHotMiddleware(compiler));

  server.listen(port, "localhost", (error?: Error): void => {
    if (error) {
      console.log(error);
      process.exit(1);
      return;
    }

    console.log(`Server running at http://localhost:${port}`);
    startApp();
  });
}
