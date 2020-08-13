import getPackageJson, { FullMetadata } from 'package-json';
import process from 'process';
import { readPackages } from './entry/readPackages';
import { ViewParams } from './params';
import { PackageInfo } from './types';

export async function view({ cwd = process.cwd(), sourceRoot = 'src', entry, onMessage }: ViewParams) {
  const internalPackages: Map<string, PackageInfo> = await readPackages({ cwd, sourceRoot, entry });

  const originMetadatas: (FullMetadata | undefined)[] = await Promise.all(
    Array.from(internalPackages.keys()).map((name) =>
      getPackageJson(name, {
        fullMetadata: true,
        allVersions: true,
      }).catch(() => undefined),
    ),
  );

  const metadatas: FullMetadata[] = originMetadatas.filter(
    (metadata): metadata is FullMetadata => !!metadata,
  );

  for (const metadata of metadatas) {
    if (!internalPackages.has(metadata.name)) {
      throw new Error(`undefined package ${metadata.name}`);
    }

    const info: PackageInfo = internalPackages.get(metadata.name)!;
    const tags: Record<string, string> = metadata['dist-tags'];

    await onMessage({
      type: 'view',
      metadata,
      tags,
      packageConfig: info,
    });
  }
}
