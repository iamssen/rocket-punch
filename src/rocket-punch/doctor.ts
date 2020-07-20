import depcheck, { Results } from 'depcheck';
import { getPackagesEntry } from './entry/getPackagesEntry';
import { PackageInfo } from './types';

export type DoctorMessages = {
  type: 'depcheck';
  result: Results;
};

interface Params {
  cwd?: string;

  onMessage: (message: DoctorMessages) => Promise<void>;
}

export async function doctor({ cwd = process.cwd(), onMessage }: Params) {
  const internalPackages: Map<string, PackageInfo> = await getPackagesEntry({ cwd });

  const result = await depcheck(cwd, {
    ignoreMatches: [...Array.from(internalPackages.values()).map(({ name }) => name)],
  });

  await onMessage({
    type: 'depcheck',
    result,
  });
}
