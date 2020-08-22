import path from 'path';
import { readEntry } from 'rocket-punch/entry/readEntry';
import yargs from 'yargs';

const argv = yargs.argv;

function toValue<T>(value: unknown): T | undefined {
  return (value as T) ?? undefined;
}

export const sourceDir: string = path.resolve(__dirname, '../source');
export const entry = readEntry({ cwd: sourceDir });
export const outDir: string = toValue(argv['out-dir']) ?? path.resolve(__dirname, '../out/packages');
export const registry: string | undefined = toValue(argv['registry']);
export const tag: string | undefined = toValue(argv['tag']);
export const skipSelection: boolean | undefined = toValue(argv['skip-selection']);
