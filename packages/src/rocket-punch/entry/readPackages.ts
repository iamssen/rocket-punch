import fs from 'fs-extra';
import path from 'path';
import { PackageConfig, PackageInfo } from '../types';

interface Params {
  cwd: string;
  sourceRoot: string;
  entry: Record<string, string | PackageConfig>;
}

export async function readPackages({
  cwd,
  sourceRoot,
  entry,
}: Params): Promise<Map<string, PackageInfo>> {
  const packages: Record<string, string | PackageConfig> = {};

  for (const name of Object.keys(entry)) {
    if (/\/\*$/.test(name)) {
      const groupName: string = name.split('/')[0];
      const dir: string = path.resolve(cwd, sourceRoot, groupName);
      const files: string[] = await fs.readdir(dir);

      for (const pkgName of files) {
        const pkgDir: string = path.join(dir, pkgName);
        const groupAndPkgName: string = groupName + '/' + pkgName;
        if (
          fs.statSync(pkgDir).isDirectory() &&
          fs.readdirSync(pkgDir).length > 0 &&
          !packages[groupAndPkgName]
        ) {
          packages[groupName + '/' + pkgName] = entry[name];
        }
      }
    } else if (!packages[name]) {
      packages[name] = entry[name];
    }
  }

  return Object.keys(packages).reduce((map, name) => {
    const versionOrInfo: string | PackageConfig = packages[name];

    if (typeof versionOrInfo === 'string') {
      map.set(name, {
        name,
        version: versionOrInfo,
        tag: 'latest',
        //module: 'esm',
        exports: {
          main: 'module',
          module: true,
          commonjs: true,
        },
        access: undefined,
        registry: undefined,
        compilerOptions: {},
        packageJson: {},
      });
    } else {
      const exports = versionOrInfo.exports ?? ['module', 'commonjs'];

      const commonjsExists = Array.from(exports).includes('commonjs');

      const moduleExists = Array.from(exports).includes('module');

      if (!commonjsExists && !moduleExists) {
        throw new Error(`there are no exports! ${versionOrInfo.exports}`);
      }

      const main = exports[0];

      if (!main) {
        throw new Error(`can't resolve main`);
      }

      map.set(name, {
        name,
        version: versionOrInfo.version,
        tag: versionOrInfo.tag ?? 'latest',
        //module: versionOrInfo.module === 'esm' ? 'esm' : 'commonjs',
        exports: {
          main,
          module: moduleExists,
          commonjs: commonjsExists,
        },
        access: versionOrInfo.access,
        registry: versionOrInfo.registry,
        compilerOptions: versionOrInfo.compilerOptions ?? {},
        packageJson: versionOrInfo.packageJson ?? {},
      });
    }

    return map;
  }, new Map<string, PackageInfo>());
}
