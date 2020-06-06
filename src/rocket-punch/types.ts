import { PackageJson } from 'type-fest';

export interface PackageConfig {
  version: string;
  tag?: string;
}

export interface PackageInfo {
  name: string;
  version: string;
  tag: string;
}

export interface PublishOption {
  name: string;
  tag: string;
  current: PackageJson;
  remote: PackageJson | undefined;
}

export { PackageJson };

export type PackageJsonTransformFunction = (computedPackageJson: PackageJson) => PackageJson;

export interface PackageJsonTransformFile {
  default: PackageJsonTransformFunction;
}
