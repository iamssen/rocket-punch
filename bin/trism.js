#!/usr/bin/env node
const { init, build, publish } = require('../lib');
const cwd = process.cwd();

const {
  _: [command],
  force,
} = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('init', 'Init your project', (yargs) => {
    return yargs.example('$0 init', 'Init your project');
  })
  .command('build', 'Build packages', (yargs) => {
    return yargs.example('$0 build', 'Build all packages');
  })
  .command('publish', 'Publish packages', (yargs) => {
    return yargs
      .example('$0 publish', 'Publish packages with your selection')
      .example('$0 publish --force', 'Publish packages without your selection for CI')
      .alias('f', 'force')
      .describe('f', 'Force publish packages')
      .boolean(['f']);
  })
  .demandCommand()
  .help('h')
  .alias('h', 'help')
  .epilog('🌈 Trism.js').argv;

switch (command) {
  case 'init':
    init({ cwd });
    break;
  case 'build':
    build({ cwd });
    break;
  case 'publish':
    publish({ cwd, force });
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}
