import { publish } from './commands/publish';
import { build } from './commands/build';
import { init } from './commands/init';

export * from './types';

export { build, init, publish };

export function cli([command, ...args]: string[]) {
  const cwd: string = process.cwd();

  if (command === 'init') {
    init({ cwd });
  } else if (command === 'build') {
    build({ cwd });
  } else if (command === 'publish') {
    publish({ cwd });
  }
}
