import path from 'path';
import { build } from 'rocket-punch';
import { readEntry } from 'rocket-punch/entry/readEntry';
import { buildMessageHandler } from 'rocket-punch/message-handlers/build';
import yargs from 'yargs';

const argv = yargs.argv;
const outDir: string | undefined = typeof argv['out-dir'] === 'string' ? argv['out-dir'] : undefined;

build({
  cwd: process.cwd(),
  entry: readEntry({ cwd: process.cwd() }),
  dist: outDir ?? path.join(process.cwd(), 'out/packages'),
  onMessage: buildMessageHandler,
});
