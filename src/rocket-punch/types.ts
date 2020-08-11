import { LiteralUnion, PackageJson } from 'type-fest';

/** Scheme of .packages.yaml */
export interface PackageConfig {
  version: string;
  tag?: LiteralUnion<'latest' | 'canary' | 'next', string>; // ?= latest
  module?: 'commonjs' | 'esm'; // ?= commonjs
  compilerOptions?: object; // ?= {}
  packageJson?: PackageJson; // ?= {}
}

export interface PackageInfo {
  name: string;
  version: string;
  tag: string;
  module: 'commonjs' | 'esm';
  compilerOptions: object;
  packageJson: object;
}

export interface PublishOption {
  name: string;
  tag: string;
  current: PackageJson;
  remote: PackageJson | undefined;
}

export { PackageJson };
