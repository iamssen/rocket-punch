import { parseTSConfig, readTSConfig } from '@ssen/read-tsconfig';
import fs from 'fs-extra';
import path from 'path';
import ts from 'typescript';
import { PackageInfo } from '../types';

interface Params {
  searchPath: string;
  configName: string;
  packageInfo: PackageInfo;
  buildType: 'module' | 'commonjs';
  declaration: boolean;
}

export function getCompilerOptions({
  searchPath,
  configName,
  packageInfo,
  buildType,
  declaration,
}: Params): ts.CompilerOptions {
  const { options: tsconfig } = fs.existsSync(path.join(searchPath, configName))
    ? readTSConfig(searchPath, configName)
    : { options: {} as ts.CompilerOptions };
  const { options: info } = parseTSConfig(searchPath, {
    compilerOptions: packageInfo.compilerOptions,
  });
  const defaultValues: Partial<ts.CompilerOptions> = {
    downlevelIteration: true,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,

    strict: true,

    resolveJsonModule: true,

    allowJs: true,
    jsx: ts.JsxEmit.React,

    target: ts.ScriptTarget.ES2018,
  } as const;

  const computed: ts.CompilerOptions = Object.keys(defaultValues).reduce(
    (result, name) => {
      result[name] = info[name] ?? tsconfig[name] ?? defaultValues[name];
      return result;
    },
    {} as ts.CompilerOptions,
  );

  return {
    ...computed,
    module:
      buildType === 'module' ? ts.ModuleKind.ES2020 : ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    skipLibCheck: true,
    //inlineSourceMap: true,
    declaration,
  };
}
