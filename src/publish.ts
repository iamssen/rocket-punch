import path from 'path';
import { PackageInfo, PublishOption } from './types';
import { getInternalPackages } from './packageJson/getInternalPackages';
import { getPublishOptions } from './publish/getPublishOptions';
import { exec } from './utils/promisify';
import { selectPublishOptions } from './publish/selectPublishOptions';

interface Params {
  cwd?: string;
  force?: boolean;
}

export async function publish({ cwd = process.cwd(), force = false }: Params) {
  try {
    const internalPackages: Map<string, PackageInfo> = await getInternalPackages({ cwd });

    const publishOptions: Map<string, PublishOption> = await getPublishOptions({
      cwd,
      packages: internalPackages,
    });

    const selectedPublishOptions: PublishOption[] = await selectPublishOptions({ publishOptions, force });

    for (const publishOption of selectedPublishOptions) {
      console.log(`npm publish ${publishOption.name} --tag ${publishOption.tag}`);
      console.log('');

      const command: string =
        process.platform === 'win32'
          ? `cd "${path.join(cwd, 'dist', publishOption.name)}" && npm publish --tag ${publishOption.tag}`
          : `cd "${path.join(cwd, 'dist', publishOption.name)}"; npm publish --tag ${publishOption.tag};`;

      const { stderr, stdout } = await exec(command, { encoding: 'utf8' });
      console.log(stdout);
      console.error(stderr);
    }
  } catch (error) {
    console.error(error);
  }
}
