import child_process from "child_process";
import electronInstaller from "electron-winstaller";
import path from "path";
import { getDistPath, getMacOSZipPath } from "./dist-info";

const distPath: string = getDistPath();
const outputDir: string = path.join(distPath, "..", "installer");

if (process.platform === "darwin") {
  packageMacOS();
}
if (process.platform === "win32") {
  packageWindows();
}

function packageMacOS() {
  const dest: string = getMacOSZipPath();

  child_process.execSync(
    `ditto -ck --keepParent "${distPath}/electronreactmobxtemplate.app" "${dest}"`
  );
  console.log(`Zipped to ${dest}`);
}

async function packageWindows(): Promise<void> {
  const options: electronInstaller.Options = {
    name: "electronreactmobxtemplate.nupkg",
    appDirectory: distPath,
    outputDirectory: outputDir,
    authors: "YOUR COMPANY NAME",
    description: "SOME DESCRIPTION",
    exe: "electronreactmobxtemplate.exe",
    title: "electronreactmobxtemplate",
    setupExe: "electronreactmobxtemplate Setup.exe",
    setupMsi: "electronreactmobxtemplate Setup.msi",
  };

  try {
    await electronInstaller.createWindowsInstaller(options);
    console.log(`Installers created in ${outputDir}`);
  } catch (error) {
    console.log(`Error packaging: ${error}`);
    process.exit(1);
  }
}
