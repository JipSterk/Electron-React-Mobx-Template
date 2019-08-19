import { spawnSync, SpawnSyncOptions } from "child_process";
import * as path from "path";

const root = path.dirname(__dirname);

const options: SpawnSyncOptions = {
  cwd: root,
  stdio: "inherit"
};

const result = spawnSync(
  "yarn",
  ["--cwd", "app", "install", "--force"],
  options
);

if (result.status !== 0) {
  process.exit(result.status!);
}
