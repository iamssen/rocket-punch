import { flatPackageName } from '@ssen/flat-package-name';
import { AvailablePublishOption, getPublishOptions, selectPublishOptions } from '@ssen/publish-packages';
import path from 'path';
import process from 'process';
import { readPackages } from 'rocket-punch/entry/readPackages';
import { PublishParams } from './params';
import { PackageInfo, PublishOption } from './types';

export async function publish({
  cwd = process.cwd(),
  dist = path.join(cwd, 'out/packages'),
  skipSelection = false,
  tag,
  access,
  entry,
  registry,
  onMessage,
}: PublishParams) {
  const packages: Map<string, PackageInfo> = await readPackages({
    cwd,
    entry,
  });

  const publishOptions: Map<string, PublishOption> = await getPublishOptions({
    packages,
    outDir: dist,
    tag,
    registry,
  });

  const selectedPublishOptions: AvailablePublishOption[] = await selectPublishOptions({
    publishOptions,
    skipSelection,
  });

  for (const publishOption of selectedPublishOptions) {
    const packageInfo: PackageInfo | undefined = packages.get(publishOption.name);

    if (!packageInfo) {
      throw new Error(`Undefined packageInfo "${publishOption.name}"`);
    }

    const p: string[] = [`--tag ${tag || publishOption.tag}`];

    if (access) {
      p.push(`--access ${access}`);
    } else if (packageInfo.access) {
      p.push(`--access ${packageInfo.access}`);
    }

    if (registry) {
      p.push(`--registry "${registry}"`);
    } else if (packageInfo.registry) {
      p.push(`--registry "${packageInfo.registry}"`);
    }

    const command: string =
      process.platform === 'win32'
        ? `cd "${path.join(dist, flatPackageName(publishOption.name))}" && npm publish ${p.join(' ')}`
        : `cd "${path.join(dist, flatPackageName(publishOption.name))}"; npm publish ${p.join(' ')};`;

    await onMessage({
      type: 'exec',
      command,
      publishOption,
    });

    //const { stderr, stdout } = await exec(command, { encoding: 'utf8' });
    //console.log(stdout);
    //console.error(stderr);
  }
}
