import { readTSConfig } from '@ssen/read-tsconfig';
import depcheck from 'depcheck';
import path from 'path';
import process from 'process';
import { readPackages } from './entry/readPackages';
import { DoctorParams } from './params';
import { PackageInfo } from './types';

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
