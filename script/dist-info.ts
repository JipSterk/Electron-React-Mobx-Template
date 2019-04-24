import * as path from "path";

const projectRoot: string = path.join(__dirname, "..");

export function getDistRoot(): string {
  return path.join(projectRoot, "dist");
}

export function getDistPath(): string {
  return path.join(`${getDistRoot()}`, "electronreactmobxtemplate-win32-x64");
}
