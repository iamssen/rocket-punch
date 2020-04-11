import fs from 'fs-extra';
import path from 'path';
import { packagesFileName, rootConfigDirectoryName } from './configs/fileNames';
import { initialPackages } from './configs/initialPackages';
import { initialTsconfig } from './configs/initialTsconfig';

interface Params {
  cwd?: string;
  tsconfig?: object;
}

export function init({ cwd = process.cwd(), tsconfig = initialTsconfig }: Params) {
  fs.writeFileSync(path.join(cwd, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2), { encoding: 'utf8' });
  fs.mkdirpSync(path.join(cwd, rootConfigDirectoryName));
  fs.writeFileSync(path.join(cwd, rootConfigDirectoryName, packagesFileName), initialPackages, { encoding: 'utf8' });
}
