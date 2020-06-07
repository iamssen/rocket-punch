import yargs from 'yargs';
import { build } from './build';
import { buildMessageHandler } from './message-handlers/build';
import { publishMessageHandler } from './message-handlers/publish';
import { viewMessageHandler } from './message-handlers/view';
import { publish } from './publish';
import { view } from './view';

const cwd: string = process.cwd();

const argv = yargs
  .command('build', 'Build Packages')
  .command('publish', 'Publish Packages')
  .command('view', 'View Packages Info')
  .demandCommand()
  .option('out-dir', {
    type: 'string',
    alias: 'o',
    describe: 'output directory',
  })
  .option('skip-selection', {
    type: 'boolean',
    alias: 's',
    describe: 'if true publish all packages without user selection',
  })
  .option('tag', {
    type: 'string',
    alias: 't',
    describe: 'npm publish --tag {tag}',
  })
  .option('registry', {
    type: 'string',
    alias: 'r',
    describe: 'npm publish --registry {registry}',
  })
  .example('$0 build', 'Build packages')
  .example('$0 build --out-dir /some/directory', 'Build packages to specific directory')
  .example('$0 publish', 'Publish packages')
  .example('$0 publish --out-dir /some/directory', 'Publish packages from specific directory')
  .example('$0 publish --skip-selection', 'Publish all packages without user selection (e.g. CI)')
  .example('$0 publish --skip-selection --tag e2e --registry http://localhost:4873', 'E2E test')
  .wrap(yargs.terminalWidth())
  .help('h')
  .alias('h', 'help')
  .epilog('🚀 Rocket Punch!').argv;

switch (argv._[0]) {
  case 'build':
    build({
      cwd,
      dist: argv['out-dir'],
      onMessage: buildMessageHandler,
    });
    break;
  case 'publish':
    publish({
      cwd,
      dist: argv['out-dir'],
      skipSelection: argv['skip-selection'],
      tag: argv['tag'],
      registry: argv['registry'],
      onMessage: publishMessageHandler,
    });
    break;
  case 'view':
    view({
      cwd,
      onMessage: viewMessageHandler,
    });
    break;
  default:
    yargs.showHelp('error');
    break;
}
