import path from "path";

const projectRoot = path.join(__dirname, "..");

export function getMacOSZipPath(): string {
  return path.join(getDistPath(), "..", "electronreactmobxtemplate.zip");
}

export function getDistRoot(): string {
  return path.join(projectRoot, "dist");
}

export function getDistPath(): string {
  return path.join(
    `${getDistRoot()}`,
    `electronreactmobxtemplate-${process.platform}-x64`
  );
}
