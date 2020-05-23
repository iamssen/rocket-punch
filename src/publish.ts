import path from 'path';
import { getInternalPackages } from './packageJson/getInternalPackages';
import { getPublishOptions } from './publish/getPublishOptions';
import { selectPublishOptions } from './publish/selectPublishOptions';
import { PackageInfo, PublishOption } from './types';
import { flatPackageName } from './utils/flatPackageName';
import { exec } from './utils/promisify';

interface Params {
  cwd?: string;
  force?: boolean;
  tag?: string;
  registry?: string;
}

export async function publish({ cwd = process.cwd(), force = false, tag, registry }: Params) {
  try {
    const internalPackages: Map<string, PackageInfo> = await getInternalPackages({ cwd });

    const publishOptions: Map<string, PublishOption> = await getPublishOptions({
      cwd,
      tag,
      registry,
      packages: internalPackages,
    });

    const selectedPublishOptions: PublishOption[] = await selectPublishOptions({ publishOptions, force });

    for (const publishOption of selectedPublishOptions) {
      const t: string = ` --tag ${tag || publishOption.tag}`;
      const r: string = registry ? ` --registry "${registry}"` : '';

      console.log(`npm publish ${publishOption.name}${t}${r}`);
      console.log('');

      const command: string =
        process.platform === 'win32'
          ? `cd "${path.join(cwd, 'dist', flatPackageName(publishOption.name))}" && npm publish${t}${r}`
          : `cd "${path.join(cwd, 'dist', flatPackageName(publishOption.name))}"; npm publish${t}${r};`;

      const { stderr, stdout } = await exec(command, { encoding: 'utf8' });
      console.log(stdout);
      console.error(stderr);
    }
  } catch (error) {
    console.error(error);
  }
}
