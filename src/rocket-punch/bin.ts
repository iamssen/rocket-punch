import path from 'path';
import yargs from 'yargs';
import { build } from './build';
import { doctor } from './doctor';
import { buildMessageHandler } from './message-handlers/build';
import { doctorMessageHandler } from './message-handlers/doctor';
import { publishMessageHandler } from './message-handlers/publish';
import { viewMessageHandler } from './message-handlers/view';
import { publish } from './publish';
import { view } from './view';

const cwd: string = process.cwd();

const argv = yargs
  .command('build', 'Build packages')
  .command('publish', 'Publish packages')
  .command('view', 'View packages information')
  .command('doctor', 'Check configs is validate for rocket-punch')
  .demandCommand()
  .option('tsconfig', {
    type: 'string',
    describe: 'if specific this option it will use that file instead of tsconfig.json',
  })
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
  .example('$0 build --tsconfig tsconfig.build.json', 'Use another tsconfig.json file on build')
  .example('$0 publish', 'Publish packages')
  .example('$0 publish --out-dir /some/directory', 'Publish packages from specific directory')
  .example('$0 publish --skip-selection', 'Publish all packages without user selection (e.g. CI)')
  .example('$0 publish --skip-selection --tag e2e --registry http://localhost:4873', 'E2E test')
  .example('$0 view', 'View packages information')
  .example('$0 doctor', 'Check configs is validate for rocket-punch')
  .wrap(yargs.terminalWidth())
  .help('h')
  .alias('h', 'help')
  .epilog('🚀 Rocket Punch!').argv;

function toAbsolutePath(dir: string | undefined): string | undefined {
  if (typeof dir !== 'string') {
    return undefined;
  } else if (path.isAbsolute(dir)) {
    return dir;
  } else {
    return path.join(cwd, dir);
  }
}

switch (argv._[0]) {
  case 'build':
    build({
      cwd,
      dist: toAbsolutePath(argv['out-dir']),
      tsconfig: argv['tsconfig'],
      onMessage: buildMessageHandler,
    });
    break;
  case 'publish':
    publish({
      cwd,
      dist: toAbsolutePath(argv['out-dir']),
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
  case 'doctor':
    doctor({
      cwd,
      onMessage: doctorMessageHandler,
    });
    break;
  default:
    yargs.showHelp('error');
    break;
}
