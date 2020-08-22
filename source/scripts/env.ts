import path from 'path';
import { readEntry } from 'rocket-punch/entry/readEntry';
import yargs from 'yargs';

const argv = yargs.argv;

export function readArgv<T>(value: unknown): T | undefined {
  return Array.isArray(value) ? value.pop() : (value as T) ?? undefined;
}

export const sourceDir: string = path.dirname(__dirname);
export const entry = readEntry({ cwd: sourceDir });
export const outDir: string = readArgv(argv['out-dir']) ?? path.resolve(sourceDir, 'out/packages');
export const registry: string | undefined = readArgv(argv['registry']);
export const tag: string | undefined = readArgv(argv['tag']);
export const skipSelection: boolean | undefined = readArgv(argv['skip-selection']);
