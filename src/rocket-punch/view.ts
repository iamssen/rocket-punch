import chalk from 'chalk';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import getPackageJson, { FullMetadata } from 'package-json';
import path from 'path';
import { packagesFileName } from './rule/fileNames';
import { PackageConfig } from './types';

interface Params {
  cwd?: string;
}

export async function view({ cwd = process.cwd() }: Params) {
  const source: string = await fs.readFile(path.join(cwd, packagesFileName), {
    encoding: 'utf8',
  });
  const packages: { [name: string]: string | PackageConfig } = yaml.safeLoad(source);

  const metadatas: FullMetadata[] = await Promise.all(
    Object.keys(packages).map((name) =>
      getPackageJson(name, {
        fullMetadata: true,
        allVersions: true,
      }),
    ),
  );

  for (const metadata of metadatas) {
    if (!packages[metadata.name]) {
      throw new Error(`undefined package ${metadata.name}`);
    }
    const info: string | PackageConfig = packages[metadata.name];
    console.log(chalk.bold(`🧩 ${metadata.name}`));
    const tags: { [tag: string]: string } = metadata['dist-tags'];
    const tagList: string[] = Object.keys(tags);
    const maxLength: number = Math.max(...tagList.map((tag) => tag.length));
    const currentTag: string = typeof info !== 'string' ? info.tag || 'latest' : 'latest';

    tagList.forEach((tag) => {
      console.log(chalk.dim(`${tag.padEnd(maxLength, ' ')} : ${tags[tag]} ${currentTag === tag ? '*' : ''}`));
    });
    console.log('');
  }
}
