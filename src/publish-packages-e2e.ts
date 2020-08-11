import path from 'path';
import { publish } from 'rocket-punch';
import { readEntry } from 'rocket-punch/entry/readEntry';
import { publishMessageHandler } from 'rocket-punch/message-handlers/publish';
import yargs from 'yargs';

const argv = yargs.argv;

publish({
  cwd: process.cwd(),
  entry: readEntry({ cwd: process.cwd() }),
  dist: path.join(process.cwd(), 'out/packages'),
  skipSelection: true,
  tag: argv.tag as string,
  registry: argv.registry as string,
  onMessage: publishMessageHandler,
});
