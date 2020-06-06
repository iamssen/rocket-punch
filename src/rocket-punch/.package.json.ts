import { PackageJsonFactoryFunction } from 'rocket-punch';

export default ((computedPackageJson) => ({
  ...computedPackageJson,
  bin: {
    'rocket-punch': './bin/rocket-punch.js',
  },
})) as PackageJsonFactoryFunction;
