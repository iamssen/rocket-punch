import { PackageJson } from 'type-fest';
import { PackageInfo } from '../types';

interface Params {
  packageDir: string;
  packageInfo: PackageInfo;
  dependencies: PackageJson.Dependency;
  sharedConfig?: PackageJson;
}

export async function computePackageJson({
  packageDir,
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

    main: 'index.js',
    typings: 'index.d.ts',

    ...packageInfo.packageJson,

    name: packageInfo.name,
    version: packageInfo.version,
    dependencies: dependencies,
  };

  if (packageInfo.module === 'esm') {
    computedConfig.type = 'module';
    computedConfig.engines = computedConfig.engines ?? {};
    computedConfig.engines.node = computedConfig.engines.node ?? '>=14';
  }

  return computedConfig;

  //const factoryFile: string = path.join(packageDir, packageTransformFile);
  //
  //try {
  //  const { transformPackageJson } = requireTypescript<PackageTransformFile>(factoryFile);
  //  return typeof transformPackageJson === 'function' ? transformPackageJson(computedConfig) : computedConfig;
  //} catch {
  //  return computedConfig;
  //}
}
