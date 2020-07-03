import { PackageJsonTransformFunction } from 'rocket-punch';

export const transformPackageJson: PackageJsonTransformFunction = (computedPackageJson) => {
  return {
    ...computedPackageJson,
    keywords: ['hello'],
  };
};
