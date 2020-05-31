import path from "path";
import { getProductName } from "../app/package-info";

const productName = getProductName();

const projectRoot = path.join(__dirname, "..");

export function getMacOSZipPath(): string {
  return path.join(getDistPath(), "..", `${productName}.zip`);
}

export function getDistRoot(): string {
  return path.join(projectRoot, "dist");
}

export function getDistPath(): string {
  return path.join(
    `${getDistRoot()}`,
    `${getExecutableName()}-${process.platform}-x64`
  );
}

export function getExecutableName(): string {
  const suffix = process.env.NODE_ENV === "development" ? "-dev" : "";

  if (process.platform === "win32") {
    return `${getWindowsIdentifierName()}${suffix}`;
  } else if (process.platform === "linux") {
    return "desktop";
  } else {
    return productName;
  }
}

export function getWindowsIdentifierName(): string {
  return "electronreactmobxtemplate";
}
