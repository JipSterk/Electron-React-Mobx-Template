import { bundleID, companyName, productName, version } from "./package.json";

export function getProductName(): string {
  return process.env.NODE_ENV === "development"
    ? `${productName}-dev`
    : productName;
}

export function getCompanyName(): string {
  return companyName;
}

export function getVersion(): string {
  return version;
}

export function getBundleID(): string {
  return bundleID;
}
