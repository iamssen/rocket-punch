import fs from 'fs';
import path from 'path';
import { initialTsconfig } from './configs/initialTsconfig';
import { packagesFileName } from './configs/packagesFileName';
import { initialPackages } from './configs/initialPackages';

interface Params {
  cwd?: string;
  tsconfig?: object;
}

export function init({ cwd = process.cwd(), tsconfig = initialTsconfig }: Params) {
  fs.writeFileSync(path.join(cwd, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2), { encoding: 'utf8' });
  fs.writeFileSync(path.join(cwd, packagesFileName), initialPackages, { encoding: 'utf8' });
}
