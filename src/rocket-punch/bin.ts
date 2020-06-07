import { exec } from '@ssen/promised';
import chalk from 'chalk';
import { flattenDiagnosticMessageText } from 'typescript';
import yargs from 'yargs';
import { build } from './build';
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
      onMessage: async (message) => {
        switch (message.type) {
          case 'begin':
            console.log(`START BUILD: ${message.packageName}`);
            break;
          case 'tsc':
            for (const diagnostic of message.diagnostics) {
              if (diagnostic.file && diagnostic.start) {
                const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                const message: string = flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                console.log(
                  `TS${diagnostic.code} : ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`,
                );
              } else {
                console.log(`TS${diagnostic.code} : ${flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
              }
            }
            break;
          case 'package-json':
            console.log(JSON.stringify(message.packageJson, null, 2));
            break;
          case 'success':
            console.log(`👍 ${message.packageName}@${message.packageJson.version} → ${message.outDir}`);
            break;
        }
      },
    });
    break;
  case 'publish':
    publish({
      cwd,
      dist: argv['out-dir'],
      skipSelection: argv['skip-selection'],
      tag: argv['tag'],
      registry: argv['registry'],
      onMessage: async (message) => {
        switch (message.type) {
          case 'exec':
            console.log(`npm publish ${message.command}`);
            console.log('');
            const { stderr, stdout } = await exec(message.command, { encoding: 'utf8' });
            console.log(stdout);
            console.error(stderr);
            break;
        }
      },
    });
    break;
  case 'view':
    view({
      cwd,
      onMessage: async (message) => {
        switch (message.type) {
          case 'view':
            console.log(chalk.bold(`🧩 ${message.metadata.name}`));
            const tagList: string[] = Object.keys(message.tags);
            const maxLength: number = Math.max(...tagList.map((tag) => tag.length));

            tagList.forEach((tag) => {
              console.log(
                chalk.dim(
                  `${tag.padEnd(maxLength, ' ')} : ${message.tags[tag]} ${
                    message.packageConfig.tag === tag ? '*' : ''
                  }`,
                ),
              );
            });
            console.log('');
            break;
        }
      },
    });
    break;
  default:
    yargs.showHelp('error');
    break;
}
