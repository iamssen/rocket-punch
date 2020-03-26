import fs from 'fs-extra';
import path from 'path';
import {PackageJson} from 'type-fest';
import {PackageInfo} from '../types';
import {sharedConfigFileName} from '../configs/sharedConfigFileName';
import {packageJsonFactoryFileName} from '../configs/packageJsonFactoryFileName';

interface Params {
  cwd: string;
  packageInfo: PackageInfo;
  imports: PackageJson.Dependency;
}

export async function computePackageJson({ cwd, packageInfo, imports }: Params): Promise<PackageJson> {
  const sharedConfigFile: string = path.join(cwd, sharedConfigFileName);
  const rootConfigFile: string = path.join(cwd, 'package.json');

  const sharedConfig: PackageJson = fs.existsSync(sharedConfigFile) ? fs.readJsonSync(sharedConfigFile) : {};
  const rootConfig: PackageJson = fs.readJsonSync(rootConfigFile);

  const computedConfig: PackageJson = {
    ...sharedConfig,

    name: packageInfo.name,
    version: packageInfo.version,
    dependencies: imports,
  };

  const factoryFile: string = path.join(cwd, 'src', packageInfo.name, packageJsonFactoryFileName);

  return fs.existsSync(factoryFile) ? require(factoryFile)(computedConfig, rootConfig) : computedConfig;
}
