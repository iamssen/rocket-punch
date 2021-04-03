import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';
import { packagesJsonFileName, packagesYamlFileName } from '../rule/fileNames';
import { PackageConfig } from '../types';

interface Params {
  cwd: string;
}

export function readEntry({
  cwd,
}: Params): Record<string, string | PackageConfig> {
  let packages: object | undefined = undefined;

  if (fs.existsSync(path.join(cwd, packagesJsonFileName))) {
    packages = fs.readJsonSync(path.join(cwd, packagesJsonFileName));
  } else if (fs.existsSync(path.join(cwd, packagesYamlFileName))) {
    const source: string = fs.readFileSync(
      path.join(cwd, packagesYamlFileName),
      {
        encoding: 'utf8',
      },
    );

    const content: object | number | string | null | undefined = yaml.load(
      source,
    );

    if (
      !content ||
      typeof content === 'string' ||
      typeof content === 'number'
    ) {
      throw new Error(`yaml.safeLoad does not return an object`);
    }

    packages = content;
  }

  if (!packages) {
    throw new Error(`could not find .packages.json or .packages.yaml files`);
  }

  const {
    // ignore special keys
    $schema,
    ...entry
  } = packages as Record<string, string | PackageConfig>;

  return entry;
}
