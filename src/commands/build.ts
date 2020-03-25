import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';
import ts from 'typescript';
import { TrismPackageInfo } from '../types';
import { createPackageJson } from '../utils/createPackageJson';
import { findPackageImports } from '../utils/findPackageImports';
import { fsCopySourceFilter } from '../utils/fsCopySourceFilter';
import { getExternalPackages } from '../utils/getExternalPackages';
import { getInternalPackages } from '../utils/getInternalPackages';
import { getPackageJsonContentsOrderedNames } from '../utils/getPackageJsonContentsOrderedNames';
import { rimraf } from '../utils/rimraf-promise';

interface Params {
  cwd?: string;
}

export async function build({ cwd = process.cwd() }: Params) {
  const externalPackages: PackageJson.Dependency = await getExternalPackages({ cwd });
  const internalPackages: TrismPackageInfo[] = await getInternalPackages({ cwd });

  // ------------------------

  // import 구문 수집 (package name 기준으로 dependencies 수집)
  // - typescript ast로 수집
  //   - *.test.ts, *.spec.ts 제외
  //   - __*__/* 모두 제외

  const importsMap: Map<string, PackageJson.Dependency> = new Map<string, PackageJson.Dependency>();

  for (const internalPackage of internalPackages) {
    const imports: PackageJson.Dependency = await findPackageImports({
      internalPackages,
      externalPackages,
      dir: path.join(cwd, 'src', internalPackage.name),
    });

    importsMap.set(internalPackage.name, imports);
  }

  // ------------------------

  // dependencies 기준 order 정렬
  const packageJsonContents: PackageJson[] = await Promise.all(
    internalPackages.map((packageInfo) =>
      createPackageJson({ cwd, packageInfo, imports: importsMap.get(packageInfo.name) || {} }),
    ),
  );

  const orderNames: string[] = await getPackageJsonContentsOrderedNames({
    packageJsonContents,
  });

  // ------------------------

  // typescript compile to dist/**/*.js
  // package.ts 제외
  //   - *.test.ts, *.spec.ts 제외
  //   - __*__/* 모두 제외

  for (const packageName of orderNames) {
    const packageInfo: TrismPackageInfo | undefined = internalPackages.find(({ name }) => name === packageName);
    if (!packageInfo) continue;

    const sourceDir: string = path.join(cwd, 'src', packageInfo.name);
    const outDir: string = path.join(cwd, 'dist', packageInfo.name);

    const packageJsonContent: PackageJson | undefined = packageJsonContents.find(({ name }) => packageName === name);

    if (!packageJsonContent) {
      throw new Error(`undefined packagejson content!!!`);
    }

    await rimraf(outDir);
    await fs.mkdirp(outDir);
    await fs.writeJson(path.join(outDir, 'package.json'), packageJsonContent, { encoding: 'utf8', spaces: 2 });

    const compilerOptions: ts.CompilerOptions = {
      downlevelIteration: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,

      alwaysStrict: true,
      strictNullChecks: true,
      strictBindCallApply: true,
      strictFunctionTypes: true,
      strictPropertyInitialization: true,
      resolveJsonModule: true,

      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.Latest,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      skipLibCheck: true,
      sourceMap: true,
      declaration: true,

      typeRoots: [path.join(cwd, 'node_modules/@types'), path.join(cwd, 'dist')],

      rootDir: sourceDir,
      outDir,
    };

    const host: ts.CompilerHost = ts.createCompilerHost(compilerOptions);

    const files: string[] = host.readDirectory!(
      sourceDir,
      ['.ts'],
      ['**/*.spec.ts', '**/*.test.ts', '**/__tests__', '**/__test__', '**/*.js'],
      ['**/*'],
    );

    const program: ts.Program = ts.createProgram(files, compilerOptions, host);

    const emitResult: ts.EmitResult = program.emit();
    const diagnostics: ts.Diagnostic[] = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    for (const diagnostic of diagnostics) {
      if (diagnostic.file && diagnostic.start) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const message: string = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        if (diagnostic.code !== 2688) {
          console.log(`TS${diagnostic.code} : ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        }
      } else {
        if (diagnostic.code !== 2688) {
          console.log(`TS${diagnostic.code} : ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
        }
      }
    }

    if (emitResult.emitSkipped) {
      throw new Error(`Build the declaration files of "${packageName}" is failed`);
    }

    await fs.copy(path.join(cwd, 'src', packageName), path.join(cwd, 'dist', packageName), {
      filter: fsCopySourceFilter,
    });

    console.log(`👍 ${packageName}@${internalPackages.find(({ name }) => packageName === name)!.version}`);
  }
}
