import { collectDependencies, collectScripts, getPackagesOrder } from '@ssen/collect-dependencies';
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
import { getPackagesEntry } from './entry/getPackagesEntry';
import { computePackageJson } from './package-json/computePackageJson';
import { getRootDependencies } from './package-json/getRootDependencies';
import { getSharedPackageJson } from './package-json/getSharedPackageJson';
import { fsCopySourceFilter } from './rule/fsCopySourceFilter';
import { getCompilerOptions } from './rule/getCompilerOptions';
import { readDirectoryPatterns } from './rule/readDirectoryPatterns';
import { PackageInfo } from './types';

interface Params {
  cwd?: string;
  dist?: string;
}

export async function build({ cwd = process.cwd(), dist = path.join(cwd, 'dist') }: Params) {
  // ---------------------------------------------
  // rule
  // collect information based on directory rules
  // ---------------------------------------------
  const entry: Map<string, PackageInfo> = await getPackagesEntry({ cwd });
  const externalPackages: PackageJson.Dependency = await getRootDependencies({ cwd });
  const sharedConfig: PackageJson = await getSharedPackageJson({ cwd });

  // ---------------------------------------------
  // entry
  // create build options based on rule output
  // ---------------------------------------------
  const dependenciesMap: Map<string, PackageJson.Dependency> = new Map<string, PackageJson.Dependency>();

  for (const packageName of entry.keys()) {
    const imports: PackageJson.Dependency = await collectDependencies({
      rootDir: path.join(cwd, 'src', packageName),
      internalPackages: entry,
      externalPackages,
      ...collectScripts,
    });

    dependenciesMap.set(packageName, imports);
  }

  const packageJsonMap: Map<string, PackageJson> = new Map<string, PackageJson>();

  for (const [packageName, packageInfo] of entry) {
    const dependencies: PackageJson.Dependency | undefined = dependenciesMap.get(packageName);

    if (!dependencies) {
      throw new Error(`undefiend dependencies of ${packageName}`);
    }

    const packageJson: PackageJson = await computePackageJson({
      packageInfo,
      sharedConfig,
      packageDir: path.join(cwd, 'src', packageName),
      dependencies,
    });

    packageJsonMap.set(packageName, packageJson);
  }

  const order: string[] = await getPackagesOrder({
    packageJsonContents: Array.from(packageJsonMap.values()),
  });

  // ---------------------------------------------
  // run
  // build packages
  // ---------------------------------------------
  const symlinkDirs: string[] = [];

  for (const packageName of order) {
    const packageInfo: PackageInfo | undefined = entry.get(packageName);

    if (!packageInfo) {
      throw new Error(`TODO`);
    }

    const sourceDir: string = path.join(cwd, 'src', packageName);
    const outDir: string = path.join(dist, flatPackageName(packageName));
    const packageJson: PackageJson | undefined = packageJsonMap.get(packageName);

    if (!packageJson) {
      throw new Error(`undefined packagejson content!`);
    }

    await rimraf(outDir);

    await fs.mkdirp(outDir);

    await fs.writeJson(path.join(outDir, 'package.json'), packageJson, { encoding: 'utf8', spaces: 2 });

    const compilerOptions: CompilerOptions = {
      ...getCompilerOptions(),

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
        console.log(`TS${diagnostic.code} : ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
      } else {
        console.log(`TS${diagnostic.code} : ${flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
      }
    }

    if (emitResult.emitSkipped) {
      throw new Error(`Build the declaration files of "${packageName}" is failed`);
    }

    await fs.copy(path.join(cwd, 'src', packageName), outDir, {
      filter: fsCopySourceFilter,
    });

    if (!process.env.JEST_WORKER_ID) {
      console.log(`👍 ${packageName}@${packageInfo.version} → ${outDir}`);
    }
  }

  for (const symlink of symlinkDirs) {
    fs.unlinkSync(symlink);
  }
}
