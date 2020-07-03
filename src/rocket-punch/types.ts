import { PackageJson } from 'type-fest';
import ts from 'typescript';

export interface PackageConfig {
  version: string;
  tag?: string;
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

//export interface PackageJsonTransformFile {
//  default: PackageJsonTransformFunction;
//}

export type PackageJsonTransformFunction = (computedPackageJson: PackageJson) => PackageJson;

export type CompilerOptionsTransformFunction = (
  computedCompilerOptions: ts.CompilerOptions,
) => ts.CompilerOptions;

export type CompilerHostTransformFunction = (
  compilerOptions: ts.CompilerOptions,
  compilerHost: ts.CompilerHost,
) => ts.CompilerHost;

export type EmitCustomTransformer = () => ts.CustomTransformers | undefined;

export interface PackageTransformFile {
  transformPackageJson?: PackageJsonTransformFunction;
  transformCompilerOptions?: CompilerOptionsTransformFunction;
  transformCompilerHost?: CompilerHostTransformFunction;
  emitCustomTransformer?: EmitCustomTransformer;
}
