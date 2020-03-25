import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';
import { TrismPackageInfo } from '../types';

export async function getInternalPackages({ cwd }: { cwd: string }): Promise<TrismPackageInfo[]> {
  const source: string = await fs.readFile(path.join(cwd, 'packages.yaml'), { encoding: 'utf8' });
  const packages: { [name: string]: string | { version: string; tag?: string } } = yaml.safeLoad(source);

  return Object.keys(packages).map((name) => {
    const versionOrInfo: string | { version: string; tag?: string } = packages[name];
    const version: string = typeof versionOrInfo === 'string' ? versionOrInfo : versionOrInfo.version;
    const tag: string = typeof versionOrInfo === 'string' ? 'latest' : versionOrInfo.tag || 'latest';

    return {
      name,
      version,
      tag,
    };
  });
}
