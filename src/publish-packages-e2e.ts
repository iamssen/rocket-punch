import path from 'path';
import { publish } from 'rocket-punch';
import yargs from 'yargs';

const argv = yargs.argv;

publish({
  cwd: process.cwd(),
  dist: path.join(process.cwd(), 'dist'),
  force: true,
  tag: argv.tag as string,
  registry: argv.registry as string,
});
