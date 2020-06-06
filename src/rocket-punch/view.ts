import chalk from 'chalk';
import getPackageJson, { FullMetadata } from 'package-json';
import { getPackagesEntry } from './entry/getPackagesEntry';
import { PackageConfig, PackageInfo } from './types';

interface Params {
  cwd?: string;
}

export async function view({ cwd = process.cwd() }: Params) {
  const internalPackages: Map<string, PackageInfo> = await getPackagesEntry({ cwd });

  const metadatas: FullMetadata[] = await Promise.all(
    Array.from(internalPackages.keys()).map((name) =>
      getPackageJson(name, {
        fullMetadata: true,
        allVersions: true,
      }),
    ),
  );

  for (const metadata of metadatas) {
    if (!internalPackages.has(metadata.name)) {
      throw new Error(`undefined package ${metadata.name}`);
    }
    const info: PackageConfig = internalPackages.get(metadata.name)!;
    console.log(chalk.bold(`🧩 ${metadata.name}`));
    const tags: { [tag: string]: string } = metadata['dist-tags'];
    const tagList: string[] = Object.keys(tags);
    const maxLength: number = Math.max(...tagList.map((tag) => tag.length));

    tagList.forEach((tag) => {
      console.log(chalk.dim(`${tag.padEnd(maxLength, ' ')} : ${tags[tag]} ${info.tag === tag ? '*' : ''}`));
    });
    console.log('');
  }
}
