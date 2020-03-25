import { PackageJson } from 'type-fest';

export interface Trism {}

export type TrismPackageJsonFactory = (computedPackageJson: PackageJson, sharedPackageJson: PackageJson) => PackageJson;

export interface TrismPackageInfo {
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
