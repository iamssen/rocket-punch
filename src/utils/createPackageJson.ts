import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';
import { TrismPackageInfo } from '../types';

interface Params {
  cwd: string;
  packageInfo: TrismPackageInfo;
  imports: PackageJson.Dependency;
}

export async function createPackageJson({ cwd, packageInfo, imports }: Params): Promise<PackageJson> {
  const factoryFile: string = path.join(cwd, 'src', packageInfo.name, 'package.js');
  const sharedFile: string = path.join(cwd, 'package.shared.json');
  const rootFile: string = path.join(cwd, 'package.json');

  const sharedConfig: PackageJson = fs.existsSync(sharedFile) ? await fs.readJsonSync(sharedFile) : {};
  const rootConfig: PackageJson = fs.readJsonSync(rootFile);

  const computedConfig: PackageJson = {
    ...sharedConfig,
    name: packageInfo.name,
    version: packageInfo.version,
    dependencies: imports,
  };

  const packageJsonContent: PackageJson = fs.existsSync(factoryFile)
    ? require(factoryFile)(computedConfig, rootConfig)
    : { name: packageInfo.name, version: packageInfo.version, dependencies: imports };

  return packageJsonContent;
}
