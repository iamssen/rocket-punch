import getPackageJson, { FullMetadata } from 'package-json';
import process from 'process';
import { readPackages } from 'rocket-punch/entry/readPackages';
import { PackageConfig, PackageInfo } from './types';

export type ViewMessages = {
  type: 'view';
  metadata: FullMetadata;
  tags: Record<string, string>;
  packageConfig: PackageInfo;
};

export interface ViewParams {
  cwd?: string;

  entry: Record<string, string | PackageConfig>;

  onMessage: (message: ViewMessages) => Promise<void>;
}

export async function view({ cwd = process.cwd(), entry, onMessage }: ViewParams) {
  const internalPackages: Map<string, PackageInfo> = await readPackages({ cwd, entry });

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
