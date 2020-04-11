import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';
import {
  packageConfigDirectoryName,
  packageJsonFactoryFileName,
  rootConfigDirectoryName,
  sharedPackageJsonFileName,
} from '../configs/fileNames';
import { PackageInfo } from '../types';

interface Params {
  cwd: string;
  packageInfo: PackageInfo;
  imports: PackageJson.Dependency;
}

export async function computePackageJson({ cwd, packageInfo, imports }: Params): Promise<PackageJson> {
  const sharedConfigFile: string = path.join(cwd, rootConfigDirectoryName, sharedPackageJsonFileName);
  const indexFile: string = path.join(cwd, 'src/index.ts');

  const sharedConfig: PackageJson = fs.existsSync(sharedConfigFile) ? fs.readJsonSync(sharedConfigFile) : {};
  const main: object = fs.existsSync(indexFile) ? { main: 'index.js', typings: 'index.d.ts' } : {};

  Object.keys(sharedConfig).forEach((key) => {
    const value: unknown = sharedConfig[key];
    if (typeof value === 'string') {
      sharedConfig[key] = value.replace(/({name})/g, packageInfo.name).replace(/({version})/g, packageInfo.version);
    }
  });

  const computedConfig: PackageJson = {
    ...sharedConfig,

    name: packageInfo.name,
    version: packageInfo.version,
    dependencies: imports,

    ...main,
  };

  const factoryFile: string = path.join(
    cwd,
    'src',
    packageInfo.name,
    packageConfigDirectoryName,
    packageJsonFactoryFileName,
  );

  return fs.existsSync(factoryFile) ? require(factoryFile)(computedConfig) : computedConfig;
}
