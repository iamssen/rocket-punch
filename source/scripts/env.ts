import { readLast } from '@ssen/read-last-argv';
import path from 'path';
import { readEntry } from 'rocket-punch/entry/readEntry';
import yargs from 'yargs';

const argv = yargs.argv;

export const sourceDir: string = path.dirname(__dirname);
export const entry = readEntry({ cwd: sourceDir });
export const outDir: string = readLast(argv['out-dir']) ?? path.resolve(sourceDir, 'out/packages');
export const registry: string | undefined = readLast(argv['registry']);
export const tag: string | undefined = readLast(argv['tag']);
export const skipSelection: boolean | undefined = readLast(argv['skip-selection']);
