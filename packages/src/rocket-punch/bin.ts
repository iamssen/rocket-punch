import { readLastArgv } from '@ssen/read-last-argv';
import path from 'path';
import * as process from 'process';
import yargs, { Arguments, Argv } from 'yargs';
import { build } from './build';
import { doctor } from './doctor';
import { readEntry } from './entry/readEntry';
import { buildMessageHandler } from './message-handlers/build';
import { doctorMessageHandler } from './message-handlers/doctor';
import { publishMessageHandler } from './message-handlers/publish';
import { viewMessageHandler } from './message-handlers/view';
import { BuildParams, DoctorParams, PublishParams, ViewParams } from './params';
import { publish } from './publish';
import { view } from './view';

const cwd: string = process.cwd();

type Options = Parameters<Argv['options']>[0];

type CommonArgs = {
  emit?: boolean;
  sourceRoot?: string;
};

const commonOptions: Options = {
  'emit': {
    type: 'boolean',
    default: true,
    describe:
      'if you set this false it will only print options without run (e.g. --no-emit or --emit false)',
  },
  'source-root': {
    type: 'string',
    describe: 'source root (e.g. --source-root src)',
  },
};

type BuildArgs = {
  outDir?: string;
  tsconfig?: string;
  svg?: string;
  strict?: boolean;
};

const buildOptions: Options = {
  'out-dir': {
    type: 'string',
    alias: 'o',
    describe: 'output directory (e.g. --out-dir out/packages)',
  },
  'tsconfig': {
    type: 'string',
    alias: 't',
    describe: 'tsconfig file name (e.g. --tsconfig tsconfig.dev.json)',
  },
  'svg': {
    type: 'string',
    choices: ['create-react-app', 'default'],
    describe:
      'svg compile type <default|create-react-app> (e.g. --svg default)',
  },
  'strict': {
    type: 'boolean',
    default: false,
    describe:
      'if you set this true it will return exit 1 and stop build when there are tsc build warnings',
  },
};

type PublishArgs = {
  outDir?: string;
  skipSelection?: boolean;
  tag?: string;
  access?: string;
  registry?: string;
};

const publishOptions: Options = {
  'out-dir': buildOptions['out-dir'],
  'skip-selection': {
    type: 'boolean',
    alias: 's',
    describe: 'if true publish all packages without user selection',
  },
  'tag': {
    type: 'string',
    alias: 't',
    describe: 'npm publish --tag {tag}',
  },
  'access': {
    type: 'string',
    alias: 'a',
    describe: 'npm publish --access <public|private>',
  },
  'registry': {
    type: 'string',
    alias: 'r',
    describe: 'npm publish --registry {registry}',
  },
};

function toAbsolutePath(dir: string | undefined): string | undefined {
  if (typeof dir !== 'string') {
    return undefined;
  } else if (path.isAbsolute(dir)) {
    return dir;
  } else {
    return path.join(cwd, dir);
  }
}

export function run() {
  return yargs
    .command({
      command: 'build',
      describe: 'Build packages',
      builder: (argv) =>
        argv
          .options({
            ...buildOptions,
            ...commonOptions,
          })
          .example(
            '$0 build --out-dir /some/directory',
            'Build packages to specific directory',
          )
          .example(
            '$0 build --tsconfig tsconfig.build.json',
            'Use another tsconfig.json file on build',
          )
          .example(
            '$0 build --svg default',
            'SVG transform to `import ReactComponent from "./file.svg"`',
          ),
      handler: (argv: Arguments<CommonArgs & BuildArgs>) => {
        const {
          emit,
          outDir,
          tsconfig,
          sourceRoot,
          svg,
          strict,
        } = readLastArgv(argv);
        const params: BuildParams = {
          cwd,
          svg: svg === 'default' ? 'default' : 'create-react-app',
          dist: toAbsolutePath(outDir),
          tsconfig,
          sourceRoot,
          strict,
          entry: readEntry({ cwd }),
          onMessage: buildMessageHandler,
        };

        if (emit) {
          build(params);
        } else {
          console.log(params);
        }
      },
    })
    .command({
      command: 'publish',
      describe: 'Publish packages',
      builder: (argv) =>
        argv
          .options({
            ...publishOptions,
            ...commonOptions,
          })
          .example('$0 publish', 'Publish packages')
          .example(
            '$0 publish --out-dir /some/directory',
            'Publish packages from specific directory',
          )
          .example(
            '$0 publish --skip-selection',
            'Publish all packages without user selection (e.g. CI)',
          )
          .example(
            '$0 publish --skip-selection --tag e2e --registry http://localhost:4873',
            'E2E test',
          ),
      handler: (argv: Arguments<CommonArgs & PublishArgs>) => {
        const {
          registry,
          outDir,
          sourceRoot,
          emit,
          access,
          skipSelection,
          tag,
        } = readLastArgv(argv);
        const params: PublishParams = {
          cwd,
          dist: toAbsolutePath(outDir),
          entry: readEntry({ cwd }),
          skipSelection,
          sourceRoot,
          tag,
          access:
            access === 'public' || access === 'private' ? access : undefined,
          registry,
          onMessage: publishMessageHandler,
        };

        if (emit) {
          publish(params);
        } else {
          console.log(params);
        }
      },
    })
    .command({
      command: 'view',
      describe: 'View packages information',
      builder: (argv) =>
        argv
          .options({ ...commonOptions })
          .example('$0 view', 'View packages information'),
      handler: (argv: Arguments<CommonArgs>) => {
        const { emit, sourceRoot } = readLastArgv(argv);
        const params: ViewParams = {
          cwd,
          sourceRoot,
          entry: readEntry({ cwd }),
          onMessage: viewMessageHandler,
        };

        if (emit) {
          view(params);
        } else {
          console.log(params);
        }
      },
    })
    .command({
      command: 'doctor',
      describe: 'Check configs is validate for rocket-punch',
      builder: (argv) =>
        argv
          .options({ ...commonOptions })
          .example('$0 doctor', 'Check configs is validate for rocket-punch'),
      handler: (argv: Arguments<CommonArgs>) => {
        const { emit, sourceRoot } = readLastArgv(argv);
        const params: DoctorParams = {
          cwd,
          sourceRoot,
          entry: readEntry({ cwd }),
          onMessage: doctorMessageHandler,
        };

        if (emit) {
          doctor(params);
        } else {
          console.log(params);
        }
      },
    })
    .wrap(null)
    .help('h')
    .alias('h', 'help')
    .showHelpOnFail(true)
    .demandCommand()
    .recommendCommands()
    .strict()
    .epilog('🚀 Rocket Punch!').argv;
}
