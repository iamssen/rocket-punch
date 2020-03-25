import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';

export async function getExternalPackages({ cwd }: { cwd: string }): Promise<PackageJson.Dependency> {
  const packageJson: PackageJson = await fs.readJson(path.join(cwd, 'package.json'));

  return {
    ...packageJson.devDependencies,
    ...packageJson.dependencies,
  };
}
