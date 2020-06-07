import { PackageJsonTransformFunction } from 'rocket-punch';

export default ((computedPackageJson) => {
  return {
    ...computedPackageJson,
    keywords: ['hello'],
  };
}) as PackageJsonTransformFunction;
