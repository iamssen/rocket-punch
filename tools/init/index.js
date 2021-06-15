const getPackageJson = require('package-json');
const fs = require('fs');
const path = require('path');

module.exports = async ({ cwd = process.cwd() } = {}) => {
  const { version } = await getPackageJson('rocket-punch');
  const hasSrc = fs.existsSync(path.resolve(cwd, 'src'));

  const packageConfig = path.resolve(cwd, '.package.json');
  const packagesConfig = path.resolve(cwd, '.packages.json');
  const packageJson = path.resolve(cwd, 'package.json');

  if (!fs.existsSync(packageJson)) {
    throw new Error(`There is no package.json "${packageJson}"`);
  }

  if (!fs.existsSync(packageConfig)) {
    fs.writeFileSync(
      packageConfig,
      JSON.stringify(packageConfigTemplate, null, 2),
      { encoding: 'utf8' },
    );
  }

  if (!fs.existsSync(packagesConfig)) {
    fs.writeFileSync(
      packagesConfig,
      JSON.stringify(packagesConfigTemplate, null, 2),
      { encoding: 'utf8' },
    );
  }

  const prevPackageJson = require(packageJson);

  if (
    'rocket-punch' in prevPackageJson.devDependencies ||
    'rocket-punch' in prevPackageJson.dependencies
  ) {
    return;
  }

  const nextPackageJson = { ...prevPackageJson };

  nextPackageJson.scripts = {
    ...prevPackageJson.scripts,
    'build-packages': `rocket-punch build${hasSrc ? '' : ' --source-root .'}`,
    'publish-packages': `rocket-punch publish`,
  };

  nextPackageJson.devDependencies = {
    ...prevPackageJson.devDependencies,
    'rocket-punch': `^${version}`,
  };

  fs.writeFileSync(packageJson, JSON.stringify(nextPackageJson, null, 2), {
    encoding: 'utf8',
  });
};

const packageConfigTemplate = {
  author: 'Your name <your@email.com>',
  license: 'MIT',
  repository: 'github:You/Repo',
  bugs: 'https://github.com/You/Repo/issues',
  homepage: 'https://github.com/You/Repo/tree/master/packages/src/{name}',
  engines: {
    node: '>=12',
  },
  publishConfig: {
    cache: '~/.npm',
    access: 'public',
  },
};

const packagesConfigTemplate = {
  '$schema':
    'https://rocket-hangar.github.io/rocket-punch/schemas/packages.json',
  'your-package': {
    version: '0.1.0',
    tag: 'latest',
  },
  '@your-org/*': {
    version: '0.1.0',
    tag: 'latest',
  },
};
