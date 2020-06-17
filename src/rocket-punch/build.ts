import { collectDependencies, collectScripts, getPackagesOrder } from '@ssen/collect-dependencies';
import { createExtendedCompilerHost } from '@ssen/extended-compiler-host';
import { flatPackageName } from '@ssen/flat-package-name';
import { createImportPathRewriteCompilerHost } from '@ssen/import-path-rewrite-compiler-host';
import { rimraf } from '@ssen/promised';
import { rewriteSrcPath } from '@ssen/rewrite-src-path';
import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';
import {
  CompilerHost,
  CompilerOptions,
  createProgram,
  Diagnostic,
  EmitResult,
  getPreEmitDiagnostics,
  Program,
} from 'typescript';
import { getPackagesEntry } from './entry/getPackagesEntry';
import { computePackageJson } from './package-json/computePackageJson';
import { getRootDependencies } from './package-json/getRootDependencies';
import { getSharedPackageJson } from './package-json/getSharedPackageJson';
import { fsCopyFilter } from './rule/fsCopyFilter';
import { getCompilerOptions } from './rule/getCompilerOptions';
import { readDirectoryPatterns } from './rule/readDirectoryPatterns';
import { PackageInfo } from './types';

export type BuildMessages =
  | {
      type: 'begin';
      packageName: string;
      sourceDir: string;
      outDir: string;
    }
  | {
      type: 'tsc';
      packageName: string;
      compilerOptions: CompilerOptions;
      diagnostics: Diagnostic[];
    }
  | {
      type: 'package-json';
      packageName: string;
      packageJson: PackageJson;
    }
  | {
      type: 'success';
      packageJson: PackageJson;
      packageName: string;
      sourceDir: string;
      outDir: string;
    };

interface Params {
  cwd?: string;
  dist?: string;

  onMessage: (message: BuildMessages) => Promise<void>;
}

export async function build({ cwd = process.cwd(), dist = path.join(cwd, 'dist'), onMessage }: Params) {
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
      selfNames: new Set<string>([packageName]),
      fixImportPath: ({ importPath, filePath }) =>
        rewriteSrcPath({
          rootDir: path.join(cwd, 'src'),
          importPath,
          filePath,
        }),
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

    await onMessage({
      type: 'begin',
      packageName,
      sourceDir,
      outDir,
    });

    // ---------------------------------------------
    // clean
    // ---------------------------------------------
    await rimraf(outDir);

    await fs.mkdirp(outDir);

    // ---------------------------------------------
    // symlink
    // ---------------------------------------------
    const symlink: string = path.join(cwd, 'node_modules', packageName);

    await fs.mkdirp(path.dirname(symlink));

    await fs.symlink(outDir, symlink);

    symlinkDirs.push(symlink);

    // ---------------------------------------------
    // tsc
    // ---------------------------------------------
    const computedCompilerOptions: CompilerOptions = getCompilerOptions();

    const compilerOptions: CompilerOptions = {
      ...computedCompilerOptions,

      baseUrl: sourceDir,
      paths: {
        ...computedCompilerOptions.paths,
        [packageName]: [sourceDir],
      },

      rootDir: sourceDir,
      outDir,
    };

    const extendedHost: CompilerHost = createExtendedCompilerHost(compilerOptions);
    const host: CompilerHost = createImportPathRewriteCompilerHost({
      src: path.join(cwd, 'src'),
      rootDir: sourceDir,
    })(compilerOptions, undefined, extendedHost);

    const files: string[] = host.readDirectory!(sourceDir, ...readDirectoryPatterns);

    try {
      const program: Program = createProgram(files, compilerOptions, host);
  
      //const emitResult: EmitResult = program.emit(undefined, undefined, undefined, undefined, {
      //  before: [importPathRewrite({ src: path.join(cwd, 'src') })],
      //});
      const emitResult: EmitResult = program.emit();
      const diagnostics: Diagnostic[] = getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
  
      await onMessage({
        type: 'tsc',
        packageName,
        compilerOptions,
        diagnostics,
      });
      
      if (emitResult.emitSkipped) {
        throw new Error(`Build "${packageName}" is failed`);
      }
    } catch (e) {
      console.error(e);
      throw e;
    }


    //for (const diagnostic of diagnostics) {
    //  if (diagnostic.file && diagnostic.start) {
    //    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    //    const message: string = flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    //    console.log(`TS${diagnostic.code} : ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    //  } else {
    //    console.log(`TS${diagnostic.code} : ${flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
    //  }
    //}

    // ---------------------------------------------
    // copy static files
    // ---------------------------------------------
    await fs.copy(path.join(cwd, 'src', packageName), outDir, {
      filter: fsCopyFilter,
    });

    // ---------------------------------------------
    // package.json
    // ---------------------------------------------
    await fs.writeJson(path.join(outDir, 'package.json'), packageJson, { encoding: 'utf8', spaces: 2 });

    await onMessage({
      type: 'package-json',
      packageName,
      packageJson,
    });

    //if (!process.env.JEST_WORKER_ID) {
    //  console.log(`👍 ${packageName}@${packageInfo.version} → ${outDir}`);
    //}

    await onMessage({
      type: 'success',
      packageJson,
      packageName,
      sourceDir,
      outDir,
    });
  }

  for (const symlink of symlinkDirs) {
    fs.unlinkSync(symlink);
  }
}
