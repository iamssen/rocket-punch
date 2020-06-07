import getPackageJson, { FullMetadata } from 'package-json';
import { getPackagesEntry } from './entry/getPackagesEntry';
import { PackageConfig, PackageInfo } from './types';

export type ViewMessages = {
  type: 'view';
  metadata: FullMetadata;
  tags: Record<string, string>;
  packageConfig: PackageConfig;
};

interface Params {
  cwd?: string;

  onMessage: (message: ViewMessages) => Promise<void>;
}

export async function view({ cwd = process.cwd(), onMessage }: Params) {
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
    const tags: Record<string, string> = metadata['dist-tags'];

    await onMessage({
      type: 'view',
      metadata,
      tags,
      packageConfig: info,
    });

    //console.log(chalk.bold(`🧩 ${metadata.name}`));
    //const tagList: string[] = Object.keys(tags);
    //const maxLength: number = Math.max(...tagList.map((tag) => tag.length));
    //
    //tagList.forEach((tag) => {
    //  console.log(chalk.dim(`${tag.padEnd(maxLength, ' ')} : ${tags[tag]} ${info.tag === tag ? '*' : ''}`));
    //});
    //console.log('');
  }
}
