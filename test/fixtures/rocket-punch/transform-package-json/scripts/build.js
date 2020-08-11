const { build } = require('rocket-punch');

build({
  packages: {
    a: {
      version: '0.1.0',
      tag: 'latest',
    },
    b: {
      version: '0.1.0',
      tag: 'latest',
    },
    c: {
      version: '0.1.0',
      tag: 'latest',
    },
  },
  transformPackageJson: (packageName) => (computedPackageJson) => {
    if (packageName === 'b') {
      return {
        ...computedPackageJson,
        keywords: ['hello'],
      };
    }

    return computedPackageJson;
  },
});