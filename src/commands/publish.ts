import path from 'path';
import { PublishOption, TrismPackageInfo } from '../types';
import { exec } from '../utils/exec-promise';
import { getInternalPackages } from '../utils/getInternalPackages';
import { getPublishOptions } from '../utils/getPublishOptions';
import { selectPublishOptions } from '../utils/selectPublishOptions';

interface Params {
  cwd?: string;
}

export async function publish({ cwd = process.cwd() }: Params) {
  try {
    const internalPackages: TrismPackageInfo[] = await getInternalPackages({ cwd });

    const publishOptions: PublishOption[] = await getPublishOptions({
      cwd,
      packages: internalPackages,
    });

    const selectedPublishOptions: PublishOption[] = await selectPublishOptions({ publishOptions, choice: true });

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
