import { readTSConfig } from '@ssen/read-tsconfig';
import depcheck, { Results } from 'depcheck';
import path from 'path';
import { getPackagesEntry } from './entry/getPackagesEntry';
import { PackageInfo } from './types';

export type DoctorMessages =
  | {
      type: 'depcheck';
      result: Results;
    }
  | {
      type: 'tsconfig';
      result: { message: string; fixer: object }[];
    };

interface Params {
  cwd?: string;
  tsconfig?: string;

  onMessage: (message: DoctorMessages) => Promise<void>;
}

export async function doctor({ cwd = process.cwd(), tsconfig = 'tsconfig.json', onMessage }: Params) {
  const internalPackages: Map<string, PackageInfo> = await getPackagesEntry({ cwd });

  const depcheckResult = await depcheck(cwd, {
    ignoreMatches: [...Array.from(internalPackages.values()).map(({ name }) => name)],
  });

  await onMessage({
    type: 'depcheck',
    result: depcheckResult,
  });

  const { options } = readTSConfig(path.join(cwd, tsconfig));
  const tsconfigResult: { message: string; fixer: object }[] = [];

  if (!/src$/.test(options.baseUrl ?? '')) {
    tsconfigResult.push({
      message: `compilerOptions.baseUrl should be "src".`,
      fixer: {
        compilerOptions: {
          baseUrl: 'src',
        },
      },
    });
  }

  if (tsconfigResult.length > 0) {
    await onMessage({
      type: 'tsconfig',
      result: tsconfigResult,
    });
  }
}
