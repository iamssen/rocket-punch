import fs from 'fs-extra';
import getPackageJson, { Options } from 'package-json';
import path from 'path';
import { PackageJson } from 'type-fest';
import { PublishOption, TrismPackageInfo } from '../types';

export type GetRemotePackageJson = (params: { name: string } & Options) => Promise<PackageJson | undefined>;

const getNpmRemotePackageJson: GetRemotePackageJson = ({ name, ...options }) => {
  return getPackageJson(name, options)
    .then((value) => (value && typeof value.version === 'string' ? (value as PackageJson) : undefined))
    .catch(() => undefined);
};

export async function getPublishOptions({
  cwd,
  packages,
  getRemotePackageJson = getNpmRemotePackageJson,
}: {
  packages: TrismPackageInfo[];
  cwd: string;
  getRemotePackageJson?: GetRemotePackageJson;
}): Promise<PublishOption[]> {
  const distDirectory: string = path.join(cwd, 'dist');

  if (!fs.pathExistsSync(distDirectory) || !fs.statSync(distDirectory).isDirectory()) {
    throw new Error(`"${distDirectory}" directory is undefined`);
  }

  const tags: Map<string, string> = packages.reduce((map, { name, tag }) => {
    map.set(name, tag || 'latest');
    return map;
  }, new Map());

  const currentPackageJsons: PackageJson[] = packages
    .map(({ name: packageName }) => path.join(distDirectory, packageName, 'package.json'))
    .filter((packageJsonFile) => fs.existsSync(packageJsonFile))
    .map((packageJsonFile) => fs.readJsonSync(packageJsonFile))
    .filter(({ name }) => typeof name === 'string');

  const remotePackageJsons: (PackageJson | undefined)[] = await Promise.all<PackageJson | undefined>(
    currentPackageJsons.map(({ name }) => {
      return getRemotePackageJson({
        name: name!,
        version: tags.get(name!),
        fullMetadata: true,
      });
    }),
  );

  return currentPackageJsons.map((current, i) => ({
    name: current.name!,
    tag: tags.get(current.name!)!,
    current,
    remote: remotePackageJsons[i],
  }));
}
