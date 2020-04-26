import child_process from "child_process";
import packager from "electron-packager";
import fs from "fs-extra";
import path from "path";
import { externals } from "../app/webpack.common";
import { getDistRoot } from "./dist-info";

type PackageLookup = {
  [key: string]: string;
};

type Package = {
  productName: string;
  dependencies: PackageLookup;
  devDependencies: PackageLookup;
};

const isPublishableBuild: boolean = process.env.NODE_ENV !== "development";

const projectRoot: string = path.join(__dirname, "..");
const outRoot: string = path.join(projectRoot, "out");

copyDependencies();

packageApp();

function copyDependencies(): void {
  const originalPackage: Package = require(path.join(
    projectRoot,
    "app",
    "package.json"
  ));

  const oldDependencies: PackageLookup = originalPackage.dependencies;
  const newDependencies: PackageLookup = {};

  for (const name of Object.keys(oldDependencies)) {
    const spec: string = oldDependencies[name];
    if (externals.indexOf(name) !== -1) {
      newDependencies[name] = spec;
    }
  }

  const oldDevDependencies: PackageLookup = originalPackage.devDependencies;
  const newDevDependencies: PackageLookup = {};

  if (!isPublishableBuild) {
    for (const name of Object.keys(oldDevDependencies)) {
      const spec: string = oldDevDependencies[name];
      if (externals.indexOf(name) !== -1) {
        newDevDependencies[name] = spec;
      }
    }
  }

  const updatedPackage: Package = Object.assign({}, originalPackage, {
    productName: "electronreactmobxtemplate",
    dependencies: newDependencies,
    devDependencies: newDevDependencies,
  });

  if (isPublishableBuild) {
    delete updatedPackage.devDependencies;
  }

  fs.writeFileSync(
    path.join(outRoot, "package.json"),
    JSON.stringify(updatedPackage)
  );

  fs.removeSync(path.resolve(outRoot, "node_modules"));

  if (
    Object.keys(newDependencies).length ||
    Object.keys(newDevDependencies).length
  ) {
    console.log("Installing dependencies via yarn…");
    child_process.execSync("yarn install", { cwd: outRoot, env: process.env });
  }

  if (!isPublishableBuild) {
    console.log("Installing 7zip (dependency for electron-devtools-installer)");

    const sevenZipSource: string = path.resolve(
      projectRoot,
      "app/node_modules/7zip"
    );
    const sevenZipDestination: string = path.resolve(
      outRoot,
      "node_modules/7zip"
    );

    fs.mkdirpSync(sevenZipDestination);
    fs.copySync(sevenZipSource, sevenZipDestination);
  }
}

async function packageApp(): Promise<void> {
  const toPackagePlatform = (platform: NodeJS.Platform) => {
    if (platform === "win32" || platform === "darwin" || platform === "linux") {
      return platform;
    }
    throw new Error(
      `Unable to convert to platform for electron-packager: '${process.platform}`
    );
  };

  const toPackageArch = (targetArch: string | undefined): packager.arch => {
    if (targetArch === undefined) {
      return "x64";
    }

    if (targetArch === "arm64" || targetArch === "x64") {
      return targetArch;
    }

    throw new Error(
      `Building Desktop for architecture '${targetArch}' is not supported`
    );
  };

  const options: packager.Options = {
    overwrite: true,
    platform: toPackagePlatform(process.platform),
    arch: toPackageArch(process.env.TARGET_ARCH),
    prune: false,
    out: getDistRoot(),
    dir: outRoot,
    ignore: [
      new RegExp("/node_modules/electron($|/)"),
      new RegExp("/node_modules/electron-packager($|/)"),
      new RegExp("/\\.git($|/)"),
      new RegExp("/node_modules/\\.bin($|/)"),
    ],
  };

  try {
    const appPaths: string | string[] = await packager(options);
    console.log(`Built to ${appPaths}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
