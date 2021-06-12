import { PackageJson } from 'type-fest';
import { PackageInfo } from '../types';

interface Params {
  packageInfo: PackageInfo;
  dependencies: PackageJson.Dependency;
  sharedConfig?: PackageJson;
}

export async function computePackageJson({
  packageInfo,
  dependencies,
  sharedConfig = {},
}: Params): Promise<PackageJson> {
  const shared: PackageJson = { ...sharedConfig };
  const keys = Object.keys(shared) as (keyof PackageJson)[];

  keys.forEach((key) => {
    const value: unknown = shared[key];
    if (typeof value === 'string') {
      //@ts-ignore
      shared[key] = value
        .replace(/({name})/g, packageInfo.name) // {name}
        .replace(/({version})/g, packageInfo.version); // {version}
    }
  });

  const computedConfig: PackageJson = {
    ...shared,

    //main: 'index.js',
    typings: 'index.d.ts',

    ...packageInfo.packageJson,

    name: packageInfo.name,
    version: packageInfo.version,
    dependencies: dependencies,
  };

  const commonjsDirectory =
    packageInfo.exports.main === 'commonjs' ? '.' : './_commonjs';
  computedConfig.main = `${commonjsDirectory}/index.js`;

  if (packageInfo.exports.module) {
    const moduleDirectory =
      packageInfo.exports.main === 'module' ? '.' : './_module';
    computedConfig.module = `${moduleDirectory}/index.js`;
  }

  return computedConfig;
}
