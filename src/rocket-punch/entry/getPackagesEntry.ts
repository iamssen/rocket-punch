import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';
import { packagesFileName } from '../rule/fileNames';
import { PackageInfo } from '../types';

interface Params {
  cwd: string;
}

interface Entry {
  version: string;
  tag?: string;
  module?: string;
  compilerOptions?: object;
  packageJson?: object;
}

export async function getPackagesEntry({ cwd }: Params): Promise<Map<string, PackageInfo>> {
  const source: string = await fs.readFile(path.join(cwd, packagesFileName), {
    encoding: 'utf8',
  });

  const content: object | string | undefined = yaml.safeLoad(source);
  if (!content || typeof content === 'string') {
    throw new Error(`yaml.safeLoad does not return an object`);
  }

  const entry: Record<string, string | Entry> = content as Record<string, string | Entry>;
  const packages: Record<string, string | Entry> = {};

  for (const name of Object.keys(entry)) {
    if (/\/\*$/.test(name)) {
      const groupName: string = name.split('/')[0];
      const dir: string = path.join(cwd, 'src', groupName);
      const files: string[] = await fs.readdir(dir);

      for (const pkgName of files) {
        const pkgDir: string = path.join(dir, pkgName);
        if (fs.statSync(pkgDir).isDirectory() && fs.readdirSync(pkgDir).length > 0) {
          packages[groupName + '/' + pkgName] = entry[name];
        }
      }
    } else {
      packages[name] = entry[name];
    }
  }

  return Object.keys(packages).reduce((map, name) => {
    const versionOrInfo: string | Entry = packages[name];

    if (typeof versionOrInfo === 'string') {
      map.set(name, {
        name,
        version: versionOrInfo,
        tag: 'latest',
        module: 'esm',
        compilerOptions: {},
        packageJson: {},
      });
    } else {
      map.set(name, {
        name,
        version: versionOrInfo.version,
        tag: versionOrInfo.tag ?? 'latest',
        module: versionOrInfo.module === 'esm' ? 'esm' : 'commonjs',
        compilerOptions: versionOrInfo.compilerOptions ?? {},
        packageJson: versionOrInfo.packageJson ?? {},
      });
    }

    return map;
  }, new Map<string, PackageInfo>());
}
