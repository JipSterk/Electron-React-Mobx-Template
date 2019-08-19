import { spawnSync, SpawnSyncOptions } from "child_process";
import * as glob from "glob";
import * as path from "path";

const root = path.dirname(__dirname);

const options: SpawnSyncOptions = {
  cwd: root,
  stdio: "inherit"
};

function findYarnVersion(callback: (path: string) => void) {
  glob("vendor/yarn-*.js", (error, files) => {
    if (error != null) {
      throw error;
    }

    files.sort();

    const latestVersion = files[files.length - 1];

    callback(latestVersion);
  });
}

findYarnVersion(path => {
  let result = spawnSync(
    "node",
    [path, "--cwd", "app", "install", "--force"],
    options
  );

  if (result.status !== 0) {
    process.exit(result.status!);
  }
});
