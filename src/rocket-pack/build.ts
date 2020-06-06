import { collectDependencies, collectScripts } from '@ssen/collect-dependencies';
import { createExtendedCompilerHost } from '@ssen/extended-compiler-host';
import { flatPackageName } from '@ssen/flat-package-name';
import { rimraf } from '@ssen/promised';
import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';
import {
  CompilerHost,
  CompilerOptions,
  createProgram,
  Diagnostic,
  EmitResult,
  flattenDiagnosticMessageText,
  getPreEmitDiagnostics,
  Program,
} from 'typescript';
import { computePackageJson } from './packageJson/computePackageJson';
import { getExternalPackages } from './packageJson/getExternalPackages';
import { getInternalPackages } from './packageJson/getInternalPackages';
import { getPackagesOrderedNames } from './packageJson/getPackagesOrderedNames';
import { fsCopySourceFilter } from './rule/fsCopySourceFilter';
import { getCompilerOptions } from './rule/getCompilerOptions';
import { readDirectoryPatterns } from './rule/readDirectoryPatterns';
import { PackageInfo } from './types';

interface Params {
  cwd?: string;
  dist?: string;
}

export async function build({ cwd = process.cwd(), dist = path.join(cwd, 'dist') }: Params) {
  const externalPackages: PackageJson.Dependency = await getExternalPackages({ cwd });
  const internalPackages: Map<string, PackageInfo> = await getInternalPackages({ cwd });

  const importsMap: Map<string, PackageJson.Dependency> = new Map<string, PackageJson.Dependency>();

  for (const name of internalPackages.keys()) {
    const imports: PackageJson.Dependency = await collectDependencies({
      rootDir: path.join(cwd, 'src', name),
      internalPackages,
      externalPackages,
      ...collectScripts,
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

  const symlinkDirs: string[] = [];

  for (const packageName of orderNames) {
    const packageInfo: PackageInfo | undefined = internalPackages.get(packageName);

    if (!packageInfo) {
      throw new Error(`TODO`);
    }

    const sourceDir: string = path.join(cwd, 'src', packageName);
    const outDir: string = path.join(dist, flatPackageName(packageName));

    const packageJsonContent: PackageJson | undefined = packageJsonContents.find(({ name }) => packageName === name);

    if (!packageJsonContent) {
      throw new Error(`undefined packagejson content!`);
    }

    await rimraf(outDir);
    await fs.mkdirp(outDir);
    await fs.writeJson(path.join(outDir, 'package.json'), packageJsonContent, { encoding: 'utf8', spaces: 2 });

    const compilerOptions: CompilerOptions = {
      ...getCompilerOptions(),

      // typeRoots: [path.join(cwd, 'node_modules/@types'), path.join(cwd, 'dist')],
      rootDir: sourceDir,
      outDir,
    };

    const symlink: string = path.join(cwd, 'node_modules', packageName);
    await fs.mkdirp(path.dirname(symlink));
    await fs.symlink(outDir, symlink);
    symlinkDirs.push(symlink);

    const host: CompilerHost = createExtendedCompilerHost(compilerOptions);

    const files: string[] = host.readDirectory!(sourceDir, ...readDirectoryPatterns);

    const program: Program = createProgram(files, compilerOptions, host);

    const emitResult: EmitResult = program.emit();
    const diagnostics: Diagnostic[] = getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    for (const diagnostic of diagnostics) {
      if (diagnostic.file && diagnostic.start) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const message: string = flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        //if (!ignoreCodes.has(diagnostic.code)) {
        console.log(`TS${diagnostic.code} : ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        //}
      } else {
        //if (!ignoreCodes.has(diagnostic.code)) {
        console.log(`TS${diagnostic.code} : ${flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
        //}
      }
    }

    if (emitResult.emitSkipped) {
      throw new Error(`Build the declaration files of "${packageName}" is failed`);
    }

    await fs.copy(path.join(cwd, 'src', packageName), outDir, {
      filter: fsCopySourceFilter,
    });

    console.log(`👍 ${packageName}@${packageInfo.version} → ${outDir}`);
  }

  for (const symlink of symlinkDirs) {
    fs.unlinkSync(symlink);
  }
}
