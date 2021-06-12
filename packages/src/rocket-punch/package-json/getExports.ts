import { glob } from '@ssen/promised';
import { PackageInfo } from '../types';
import type { PackageJson } from 'type-fest';

export async function getExports(
  exports: PackageInfo['exports'],
  outDir: string,
): Promise<PackageJson['exports']> {
  const result = await glob(`**/*`, {
    cwd: outDir,
    nodir: true,
    ignore: ['**/*.d.ts', '**/*.js.map', 'public/*', 'bin/*'],
  });

  const files = new Set(result);

  const moduleDirectory = exports.main === 'module' ? '.' : './_module';
  const commonjsDirectory = exports.main === 'module' ? './_commonjs' : '.';
  const secondary = exports.main === 'module' ? 'commonjs' : 'module';

  const entry = result.filter(
    (file) =>
      !file.startsWith('_commonjs') &&
      !file.startsWith('_module') &&
      file !== 'index.js',
  );

  const entryExports: PackageJson['exports'] = {};

  for (const file of entry) {
    const key = `./${file.replace(/.js$/, '')}`;

    if (!files.has(`_${secondary}/${file}`)) {
      entryExports[key] = `./${file}`;
      continue;
    }

    entryExports[key] = {
      import: `${moduleDirectory}/${file}`,
      require: `${commonjsDirectory}/${file}`,
      node: `${commonjsDirectory}/${file}`,
      default: `${moduleDirectory}/${file}`,
    };

    entryExports[key + '.js'] = {
      import: `${moduleDirectory}/${file}`,
      require: `${commonjsDirectory}/${file}`,
      node: `${commonjsDirectory}/${file}`,
      default: `${moduleDirectory}/${file}`,
    };
  }

  return {
    '.': {
      import: `${moduleDirectory}/index.js`,
      require: `${commonjsDirectory}/index.js`,
      node: `${commonjsDirectory}/index.js`,
      default: `${moduleDirectory}/index.js`,
    },
    './public/*': './public/*',
    ...entryExports,
  };
}
