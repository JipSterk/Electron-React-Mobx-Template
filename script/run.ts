import { ChildProcess, spawn, SpawnOptions } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { getDistPath } from "./dist-info";

let binaryPath: string = "";

if (process.platform === "darwin") {
  binaryPath = path.join(
    getDistPath(),
    "electronreactmobxtemplate.app",
    "Contents",
    "MacOS",
    "electronreactmobxtemplate"
  );
} else if (process.platform === "win32") {
  binaryPath = path.join(getDistPath(), "electronreactmobxtemplate.exe");
}

export function run(spawnOptions: SpawnOptions): ChildProcess | null {
  try {
    const stats: fs.Stats = fs.statSync(binaryPath);
    if (!stats.isFile()) {
      return null;
    }
  } catch (error) {
    return null;
  }

  const options: SpawnOptions = Object.assign({}, spawnOptions);

  options.env = Object.assign(options.env || {}, process.env, {
    NODE_ENV: "development"
  });

  return spawn(binaryPath, [], options);
}
