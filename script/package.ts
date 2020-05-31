import child_process from "child_process";
import { createWindowsInstaller, Options } from "electron-winstaller";
import path from "path";
import { getCompanyName, getProductName } from "../app/package-info";
import { getDistPath, getMacOSZipPath } from "./dist-info";

const distPath = getDistPath();
const productName = getProductName();
const outputDir = path.join(distPath, "..", "installer");

if (process.platform === "darwin") {
  packageMacOS();
} else if (process.platform === "win32") {
  packageWindows();
} else {
  console.error(`I dunno how to package for ${process.platform} :(`);
  process.exit(1);
}

function packageMacOS(): void {
  const dest = getMacOSZipPath();

  child_process.execSync(
    `ditto -ck --keepParent "${distPath}/${productName}.app" "${dest}"`
  );
  console.log(`Zipped to ${dest}`);
}

async function packageWindows(): Promise<void> {
  const options: Options = {
    name: "electronreactmobxtemplate.nupkg",
    appDirectory: distPath,
    outputDirectory: outputDir,
    authors: getCompanyName(),
    exe: "electronreactmobxtemplate.exe",
    title: productName,
    setupExe: "electronreactmobxtemplate Setup.exe",
    setupMsi: "electronreactmobxtemplate Setup.msi",
  };

  try {
    await createWindowsInstaller(options);
    console.log(`Installers created in ${outputDir}`);
  } catch (error) {
    console.log(`Error packaging: ${error}`);
    process.exit(1);
  }
}
