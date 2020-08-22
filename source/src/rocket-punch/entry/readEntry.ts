import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';
import { packagesFileName } from '../rule/fileNames';
import { PackageConfig } from '../types';

interface Params {
  cwd: string;
}

export function readEntry({ cwd }: Params): Record<string, string | PackageConfig> {
  const source: string = fs.readFileSync(path.join(cwd, packagesFileName), {
    encoding: 'utf8',
  });

  const content: object | string | undefined = yaml.safeLoad(source);
  if (!content || typeof content === 'string') {
    throw new Error(`yaml.safeLoad does not return an object`);
  }

  return content as Record<string, string | PackageConfig>;
}
