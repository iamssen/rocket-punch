import { collectDependencies, collectScripts, getPackagesOrder } from '@ssen/collect-dependencies';
import { createExtendedCompilerHost } from '@ssen/extended-compiler-host';
import { flatPackageName } from '@ssen/flat-package-name';
import { createImportPathRewriteCompilerHost } from '@ssen/import-path-rewrite-compiler-host';
import { rimraf } from '@ssen/promised';
import { rewriteSrcPath } from '@ssen/rewrite-src-path';
import fs from 'fs-extra';
import path from 'path';
import process from 'process';
import { PackageJson } from 'type-fest';
import ts from 'typescript';
import { readPackages } from './entry/readPackages';
import { computePackageJson } from './package-json/computePackageJson';
import { getRootDependencies } from './package-json/getRootDependencies';
import { getSharedPackageJson } from './package-json/getSharedPackageJson';
import { BuildParams } from './params';
import { fsCopyFilter } from './rule/fsCopyFilter';
import { getCompilerOptions } from './rule/getCompilerOptions';
import { readDirectoryPatterns } from './rule/readDirectoryPatterns';
import { PackageInfo } from './types';

export async function build({
  cwd = process.cwd(),
  dist = path.join(cwd, 'out/packages'),
  tsconfig = 'tsconfig.json',
  entry,
  svg = 'create-react-app',
  transformPackageJson,
  transformCompilerHost,
  transformCompilerOptions,
  emitCustomTransformers,
  onMessage,
}: BuildParams) {
  // ---------------------------------------------
  // set env
  // ---------------------------------------------
  if (svg === 'default') {
    process.env.TS_SVG_EXPORT = 'default';
  }

  // ---------------------------------------------
  // rule
  // collect information based on directory rules
  // ---------------------------------------------
  const internalPackages: Map<string, PackageInfo> = await readPackages({ cwd, entry });
  const externalPackages: PackageJson.Dependency = await getRootDependencies({ cwd });
  const sharedConfig: PackageJson = await getSharedPackageJson({ cwd });

  // ---------------------------------------------
  // entry
  // create build options based on rule output
  // ---------------------------------------------
  const dependenciesMap: Map<string, PackageJson.Dependency> = new Map<string, PackageJson.Dependency>();

  for (const packageName of internalPackages.keys()) {
    const imports: PackageJson.Dependency = await collectDependencies({
      rootDir: path.join(cwd, 'src', packageName),
      internalPackages: internalPackages,
      externalPackages,
      selfNames: new Set<string>([packageName]),
      checkUndefinedPackage: 'error',
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

  for (const [packageName, packageInfo] of internalPackages) {
    const dependencies: PackageJson.Dependency | undefined = dependenciesMap.get(packageName);

    if (!dependencies) {
      throw new Error(`undefiend dependencies of ${packageName}`);
    }

    const packageDir: string = path.join(cwd, 'src', packageName);

    const computedPackageJson: PackageJson = await computePackageJson({
      packageInfo,
      sharedConfig,
      packageDir,
      dependencies,
    });

    const packageJson: PackageJson =
      typeof transformPackageJson === 'function'
        ? transformPackageJson(packageName)(computedPackageJson)
        : computedPackageJson;

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
    const packageInfo: PackageInfo | undefined = internalPackages.get(packageName);

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

    if (fs.existsSync(symlink) && fs.lstatSync(symlink).isSymbolicLink()) {
      fs.unlinkSync(symlink);
    }

    await fs.mkdirp(path.dirname(symlink));

    await fs.symlink(outDir, symlink);

    symlinkDirs.push(symlink);

    // ---------------------------------------------
    // tsc
    // ---------------------------------------------
    const userCompilerOptions: ts.CompilerOptions = getCompilerOptions({
      searchPath: cwd,
      configName: tsconfig,
      packageInfo,
    });

    const computedCompilerOptions: ts.CompilerOptions = {
      ...userCompilerOptions,

      baseUrl: sourceDir,
      paths: {
        ...userCompilerOptions.paths,
        [packageName]: [sourceDir],
      },

      rootDir: sourceDir,
      outDir,
    };

    const compilerOptions: ts.CompilerOptions =
      typeof transformCompilerOptions === 'function'
        ? transformCompilerOptions(packageName)(computedCompilerOptions)
        : computedCompilerOptions;

    const extendedHost: ts.CompilerHost = createExtendedCompilerHost(compilerOptions);
    const pathRewriteHost: ts.CompilerHost = createImportPathRewriteCompilerHost({
      src: path.join(cwd, 'src'),
      rootDir: sourceDir,
    })(compilerOptions, undefined, extendedHost);

    const host: ts.CompilerHost =
      typeof transformCompilerHost === 'function'
        ? transformCompilerHost(packageName)(compilerOptions, pathRewriteHost)
        : pathRewriteHost;

    const files: string[] = host.readDirectory!(sourceDir, ...readDirectoryPatterns);

    const program: ts.Program = ts.createProgram(files, compilerOptions, host);

    const emitResult: ts.EmitResult = program.emit(
      undefined,
      undefined,
      undefined,
      undefined,
      typeof emitCustomTransformers === 'function' ? emitCustomTransformers(packageName)() : undefined,
    );
    const diagnostics: ts.Diagnostic[] = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    await onMessage({
      type: 'tsc',
      packageName,
      compilerOptions,
      diagnostics,
    });

    if (emitResult.emitSkipped) {
      throw new Error(`Build "${packageName}" is failed`);
    }

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
