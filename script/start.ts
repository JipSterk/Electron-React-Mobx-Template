import { ChildProcess } from "child_process";
import * as express from "express";
import * as webpack from "webpack";
import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as webpackHotMiddleware from "webpack-hot-middleware";
import configs from "../app/webpack.development";
import { run } from "./run";

function startApp(): void {
  const runningApp: ChildProcess | null = run({ stdio: "inherit" });

  if (!runningApp) {
    console.log("Couldn't launch app. Try building it");
    process.exit(1);
    return;
  }

  runningApp.on(
    "close",
    (): void => {
      process.exit(0);
    }
  );
}

if (process.env.NODE_ENV === "production") {
  startApp();
} else {
  const developmentRenderConfig: webpack.Configuration = configs[1];

  const server: express.Application = express();
  const compiler: webpack.Compiler = webpack(developmentRenderConfig);
  const port: number = Number.parseInt(process.env.PORT!) || 3000;

  server.use(
    webpackDevMiddleware(compiler, {
      publicPath: developmentRenderConfig!.output!.publicPath!
    })
  );

  server.use(webpackHotMiddleware(compiler));

  server.listen(
    port,
    "localhost",
    (error?: Error): void => {
      if (error) {
        console.log(error);
        process.exit(1);
        return;
      }

      console.log(`Server running at http://localhost:${port}`);
      startApp();
    }
  );
}
