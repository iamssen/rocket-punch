import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';
import ts from 'typescript';
import { PackageInfo } from './types';
import { computePackageJson } from './packageJson/computePackageJson';
import { collectPackageDependencies } from './packageJson/collectPackageDependencies';
import { fsCopySourceFilter } from './configs/fsCopySourceFilter';
import { getExternalPackages } from './packageJson/getExternalPackages';
import { getInternalPackages } from './packageJson/getInternalPackages';
import { getPackagesOrderedNames } from './packageJson/getPackagesOrderedNames';
import { rimraf } from './utils/promisify';
import { readDirectoryPatterns } from './configs/readDirectoryPatterns';
import { getCompilerOptions } from './configs/getCompilerOptions';
import { ignoreCodes } from './configs/ignoreCodes';

interface Params {
  cwd?: string;
}

export async function build({ cwd = process.cwd() }: Params) {
  const externalPackages: PackageJson.Dependency = await getExternalPackages({ cwd });
  const internalPackages: Map<string, PackageInfo> = await getInternalPackages({ cwd });

  const importsMap: Map<string, PackageJson.Dependency> = new Map<string, PackageJson.Dependency>();

  for (const name of internalPackages.keys()) {
    const imports: PackageJson.Dependency = await collectPackageDependencies({
      internalPackages,
      externalPackages,
      packageDir: path.join(cwd, 'src', name),
    });

    importsMap.set(name, imports);
  }

  const packageJsonContents: PackageJson[] = await Promise.all(
    Array.from(internalPackages.values()).map((packageInfo) =>
      computePackageJson({ cwd, packageInfo, imports: importsMap.get(packageInfo.name) || {} }),
    ),
  );

  const orderNames: string[] = await getPackagesOrderedNames({
    packageJsonContents,
  });

  for (const packageName of orderNames) {
    const packageInfo: PackageInfo | undefined = internalPackages.get(packageName);

    if (!packageInfo) {
      throw new Error(`TODO`);
    }

    const sourceDir: string = path.join(cwd, 'src', packageInfo.name);
    const outDir: string = path.join(cwd, 'dist', packageInfo.name);

    const packageJsonContent: PackageJson | undefined = packageJsonContents.find(({ name }) => packageName === name);

    if (!packageJsonContent) {
      throw new Error(`undefined packagejson content!`);
    }

    await rimraf(outDir);
    await fs.mkdirp(outDir);
    await fs.writeJson(path.join(outDir, 'package.json'), packageJsonContent, { encoding: 'utf8', spaces: 2 });

    const compilerOptions: ts.CompilerOptions = {
      ...getCompilerOptions(),

      typeRoots: [path.join(cwd, 'node_modules/@types'), path.join(cwd, 'dist')],
      rootDir: sourceDir,
      outDir,
    };

    const host: ts.CompilerHost = ts.createCompilerHost(compilerOptions);

    const files: string[] = host.readDirectory!(sourceDir, ...readDirectoryPatterns);

    const program: ts.Program = ts.createProgram(files, compilerOptions, host);

    const emitResult: ts.EmitResult = program.emit();
    const diagnostics: ts.Diagnostic[] = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    for (const diagnostic of diagnostics) {
      if (diagnostic.file && diagnostic.start) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const message: string = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        if (!ignoreCodes.has(diagnostic.code)) {
          console.log(`TS${diagnostic.code} : ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        }
      } else {
        if (!ignoreCodes.has(diagnostic.code)) {
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

    console.log(`👍 ${packageName}@${packageInfo.version}`);
  }
}
