import path from 'path';
import * as process from 'process';
import yargs, { Arguments, Argv } from 'yargs';
import { build, BuildParams } from './build';
import { doctor, DoctorParams } from './doctor';
import { readEntry } from 'rocket-punch/entry/readEntry';
import { buildMessageHandler } from './message-handlers/build';
import { doctorMessageHandler } from './message-handlers/doctor';
import { publishMessageHandler } from './message-handlers/publish';
import { viewMessageHandler } from './message-handlers/view';
import { publish, PublishParams } from './publish';
import { view, ViewParams } from './view';

const cwd: string = process.cwd();

type Options = Parameters<Argv['options']>[0];

type CommonArgs = {
  emit?: boolean;
};

const commonOptions: Options = {
  emit: {
    type: 'boolean',
    default: true,
    describe: 'if you set this false it will only print options without run (e.g. --no-emit or --emit false)',
  },
};

type BuildArgs = {
  outDir?: string;
  tsconfig?: string;
  svg?: string;
};

const buildOptions: Options = {
  'out-dir': {
    type: 'string',
    alias: 'o',
    describe: 'output directory (e.g. --out-dir "{cwd}/out")',
  },
  tsconfig: {
    type: 'string',
    alias: 't',
    describe: 'tsconfig file name (e.g. --tsconfig "tsconfig.dev.json")',
  },
  svg: {
    type: 'string',
    choices: ['create-react-app', 'default'],
    describe: 'svg compile type <default|create-react-app> (e.g. --svg default)',
  },
};

type PublishArgs = {
  outDir?: string;
  skipSelection?: boolean;
  tag?: string;
  registry?: string;
};

const publishOptions: Options = {
  'out-dir': buildOptions['out-dir'],
  'skip-selection': {
    type: 'boolean',
    alias: 's',
    describe: 'if true publish all packages without user selection',
  },
  tag: {
    type: 'string',
    alias: 't',
    describe: 'npm publish --tag {tag}',
  },
  registry: {
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
      builder: (yargs) =>
        yargs
          .options({
            ...buildOptions,
            ...commonOptions,
          })
          .example('$0 build --out-dir /some/directory', 'Build packages to specific directory')
          .example('$0 build --tsconfig tsconfig.build.json', 'Use another tsconfig.json file on build')
          .example('$0 build --svg default', 'SVG transform to `import ReactComponent from "./file.svg"`'),
      handler: ({ emit, outDir, tsconfig, svg }: Arguments<CommonArgs & BuildArgs>) => {
        const params: BuildParams = {
          cwd,
          svg: svg === 'default' ? 'default' : 'create-react-app',
          dist: toAbsolutePath(outDir),
          tsconfig,
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
      builder: (yargs) =>
        yargs
          .options({
            ...publishOptions,
            ...commonOptions,
          })
          .example('$0 publish', 'Publish packages')
          .example('$0 publish --out-dir /some/directory', 'Publish packages from specific directory')
          .example('$0 publish --skip-selection', 'Publish all packages without user selection (e.g. CI)')
          .example('$0 publish --skip-selection --tag e2e --registry http://localhost:4873', 'E2E test'),
      handler: ({ registry, outDir, emit, skipSelection, tag }: Arguments<CommonArgs & PublishArgs>) => {
        const params: PublishParams = {
          cwd,
          dist: toAbsolutePath(outDir),
          entry: readEntry({ cwd }),
          skipSelection,
          tag,
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
      builder: (yargs) => yargs.options({ ...commonOptions }).example('$0 view', 'View packages information'),
      handler: ({ emit }: Arguments<CommonArgs>) => {
        const params: ViewParams = {
          cwd,
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
      builder: (yargs) =>
        yargs
          .options({ ...commonOptions })
          .example('$0 doctor', 'Check configs is validate for rocket-punch'),
      handler: ({ emit }: Arguments<CommonArgs>) => {
        const params: DoctorParams = {
          cwd,
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
