import { flatPackageName } from '@ssen/flat-package-name';
import { exec } from '@ssen/promised';
import { getPublishOptions, selectPublishOptions } from '@ssen/publish-packages';
import path from 'path';
import { getPackagesEntry } from './entry/getPackagesEntry';
import { PackageInfo, PublishOption } from './types';

interface Params {
  cwd?: string;
  dist?: string;
  skipSelection?: boolean;
  tag?: string;
  registry?: string;
}

export async function publish({
  cwd = process.cwd(),
  dist = path.join(cwd, 'dist'),
  skipSelection = false,
  tag,
  registry,
}: Params) {
  try {
    const internalPackages: Map<string, PackageInfo> = await getPackagesEntry({ cwd });

    const publishOptions: Map<string, PublishOption> = await getPublishOptions({
      entry: internalPackages,
      outDir: dist,
      tag,
      registry,
    });

    const selectedPublishOptions: PublishOption[] = await selectPublishOptions({
      publishOptions,
      skipSelection,
    });

    for (const publishOption of selectedPublishOptions) {
      const t: string = ` --tag ${tag || publishOption.tag}`;
      const r: string = registry ? ` --registry "${registry}"` : '';

      console.log(`npm publish ${publishOption.name}${t}${r}`);
      console.log('');

      const command: string =
        process.platform === 'win32'
          ? `cd "${path.join(dist, flatPackageName(publishOption.name))}" && npm publish${t}${r}`
          : `cd "${path.join(dist, flatPackageName(publishOption.name))}"; npm publish${t}${r};`;

      const { stderr, stdout } = await exec(command, { encoding: 'utf8' });
      console.log(stdout);
      console.error(stderr);
    }
  } catch (error) {
    console.error(error);
  }
}
