import prompts, { Answers } from 'prompts';
import semver from 'semver';
import { PublishOption } from './types';

interface VersionInfo {
  currentVersion: string;
  remoteVersion: string | undefined;
}

export type AvailablePublishOption = PublishOption & VersionInfo;

export function getVersions({ current, remote }: PublishOption): VersionInfo {
  const currentVersion: string = current.version!;
  const remoteVersion: string | undefined =
    remote && typeof remote.version === 'string' ? remote.version : undefined;
  return { currentVersion, remoteVersion };
}

interface Params {
  publishOptions: Map<string, PublishOption>;
  skipSelection: boolean;
}

export async function selectPublishOptions({
  publishOptions,
  skipSelection,
}: Params): Promise<AvailablePublishOption[]> {
  const availablePublishOptions: (PublishOption & VersionInfo)[] = Array.from(publishOptions.values())
    .map((publishOption) => ({ ...publishOption, ...getVersions(publishOption) }))
    .filter(
      ({ currentVersion, remoteVersion }) => !remoteVersion || semver.gt(currentVersion, remoteVersion),
    );

  if (availablePublishOptions.length === 0) {
    return [];
  } else if (skipSelection) {
    return availablePublishOptions;
  } else {
    const answer: Answers<'publishOptions'> = await prompts<'publishOptions'>({
      type: 'multiselect',
      name: 'publishOptions',
      message: 'Select packages to publish',
      choices: availablePublishOptions.map(({ name, tag, currentVersion, remoteVersion }) => {
        return {
          title: remoteVersion
            ? `${name}@${tag} (${remoteVersion} → ${currentVersion})`
            : `${name}@${tag} (→ ${currentVersion})`,
          value: name,
          disabled: remoteVersion && semver.lte(currentVersion, remoteVersion),
        };
      }),
    });

    const filter: Set<string> = new Set(answer.publishOptions);

    return Array.from(availablePublishOptions.values()).filter((publishOption) =>
      filter.has(publishOption.name),
    );
  }
}
