import fs from 'fs-extra';
import path from 'path';
import { PackageConfig, PackageInfo } from '../types';

interface Params {
  cwd: string;
  entry: Record<string, string | PackageConfig>;
}

export async function readPackages({ cwd, entry }: Params): Promise<Map<string, PackageInfo>> {
  const packages: Record<string, string | PackageConfig> = {};

  for (const name of Object.keys(entry)) {
    if (/\/\*$/.test(name)) {
      const groupName: string = name.split('/')[0];
      const dir: string = path.join(cwd, 'src', groupName);
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
        module: 'esm',
        access: undefined,
        registry: undefined,
        compilerOptions: {},
        packageJson: {},
      });
    } else {
      map.set(name, {
        name,
        version: versionOrInfo.version,
        tag: versionOrInfo.tag ?? 'latest',
        module: versionOrInfo.module === 'esm' ? 'esm' : 'commonjs',
        access: versionOrInfo.access,
        registry: versionOrInfo.registry,
        compilerOptions: versionOrInfo.compilerOptions ?? {},
        packageJson: versionOrInfo.packageJson ?? {},
      });
    }

    return map;
  }, new Map<string, PackageInfo>());
}
