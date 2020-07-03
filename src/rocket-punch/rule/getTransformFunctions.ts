import { requireTypescript } from '@ssen/require-typescript';
import path from 'path';
import { packageTransformFile } from '../rule/fileNames';
import { PackageTransformFile } from '../types';

const defaultFunctions: Required<PackageTransformFile> = {
  transformPackageJson: (computedPackageJson) => computedPackageJson,
  transformCompilerOptions: (computedCompilerOptions) => computedCompilerOptions,
  transformCompilerHost: (compilerOptions, compilerHost) => compilerHost,
  emitCustomTransformer: () => undefined,
};

export function getTransformFunctions(packageDir: string): Required<PackageTransformFile> {
  try {
    const factoryFile: string = path.join(packageDir, packageTransformFile);
    const {
      transformPackageJson = defaultFunctions.transformPackageJson,
      transformCompilerOptions = defaultFunctions.transformCompilerOptions,
      transformCompilerHost = defaultFunctions.transformCompilerHost,
      emitCustomTransformer = defaultFunctions.emitCustomTransformer,
    } = requireTypescript<PackageTransformFile>(factoryFile);

    return {
      transformPackageJson,
      transformCompilerOptions,
      transformCompilerHost,
      emitCustomTransformer,
    };
  } catch {
    return defaultFunctions;
  }
}
