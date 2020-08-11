import { readTSConfig } from '@ssen/read-tsconfig';
import depcheck, { Results } from 'depcheck';
import path from 'path';
import process from 'process';
import { readPackages } from 'rocket-punch/entry/readPackages';
import { PackageConfig, PackageInfo } from './types';

export type DoctorMessages =
  | {
      type: 'depcheck';
      result: Results;
    }
  | {
      type: 'tsconfig';
      result: { message: string; fixer: object }[];
    };

export interface DoctorParams {
  cwd?: string;
  tsconfig?: string;

  entry: Record<string, string | PackageConfig>;

  onMessage: (message: DoctorMessages) => Promise<void>;
}

export async function doctor({
  cwd = process.cwd(),
  entry,
  tsconfig = 'tsconfig.json',
  onMessage,
}: DoctorParams) {
  const internalPackages: Map<string, PackageInfo> = await readPackages({ cwd, entry });

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
