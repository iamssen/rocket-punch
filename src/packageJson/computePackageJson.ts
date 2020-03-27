import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';
import { packageJsonFactoryFileName } from '../configs/packageJsonFactoryFileName';
import { sharedConfigFileName } from '../configs/sharedConfigFileName';
import { PackageInfo } from '../types';

interface Params {
  cwd: string;
  packageInfo: PackageInfo;
  imports: PackageJson.Dependency;
}

export async function computePackageJson({ cwd, packageInfo, imports }: Params): Promise<PackageJson> {
  const sharedConfigFile: string = path.join(cwd, sharedConfigFileName);
  const rootConfigFile: string = path.join(cwd, 'package.json');
  const indexFile: string = path.join(cwd, 'src/index.ts');

  const sharedConfig: PackageJson = fs.existsSync(sharedConfigFile) ? fs.readJsonSync(sharedConfigFile) : {};
  const rootConfig: PackageJson = fs.readJsonSync(rootConfigFile);
  const main: object = fs.existsSync(indexFile) ? { main: 'index.js', typings: 'index.d.ts' } : {};

  const computedConfig: PackageJson = {
    ...sharedConfig,

    name: packageInfo.name,
    version: packageInfo.version,
    dependencies: imports,

    ...main,
  };

  const factoryFile: string = path.join(cwd, 'src', packageInfo.name, packageJsonFactoryFileName);

  return fs.existsSync(factoryFile) ? require(factoryFile)(computedConfig, rootConfig) : computedConfig;
}
