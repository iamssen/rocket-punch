#!/usr/bin/env node
const { build, publish, view } = require('../');
const cwd = process.cwd();

const {
  _: [command],
  force,
  tag,
  registry,
} = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('build', 'Build packages', (yargs) => {
    return yargs.example('$0 build', 'Build all packages');
  })
  .command('publish', 'Publish packages', (yargs) => {
    return yargs
      .example('$0 publish', 'Publish packages with your selection')
      .example('$0 publish --force', 'Publish packages without your selection for CI')
      .example('$0 publish --force --tag', 'Publish packages with custom tag for E2E Test')
      .alias('f', 'force')
      .describe('f', 'Force publish packages')
      .alias('t', 'tag')
      .describe('t', 'Force change target tag')
      .describe('registry', 'Force change target registry')
      .boolean(['f']);
  })
  .command('view', 'View packages remote information', (yargs) => {
    return yargs.example('$0 view', 'View packages remote information');
  })
  .demandCommand()
  .help('h')
  .alias('h', 'help')
  .epilog('🚀 Rocket Punch!').argv;

switch (command) {
  case 'build':
    build({ cwd });
    break;
  case 'publish':
    publish({ cwd, force, tag, registry });
    break;
  case 'view':
    view({ cwd });
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}