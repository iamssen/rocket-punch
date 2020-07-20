import chalk from 'chalk';
import { DoctorMessages } from '../doctor';

export async function doctorMessageHandler(message: DoctorMessages) {
  switch (message.type) {
    case 'depcheck':
      const { dependencies, devDependencies, missing } = message.result;
      if (dependencies.length > 0) {
        console.log(
          chalk.bold(
            `Do you use these dependencies? couldn't find your source codes that using these dependencies.`,
          ),
        );
        for (const packageName of dependencies) {
          console.log(chalk.yellow(`- ${packageName}`));
        }
        console.log('');
      }

      if (devDependencies.length > 0) {
        console.log(
          chalk.bold(
            `Do you use these devDependencies? couldn't find your source codes that using these devDependencies.`,
          ),
        );
        for (const packageName of devDependencies) {
          console.log(chalk.yellow(`- ${packageName}`));
        }
        console.log('');
      }

      const missingKeys: string[] = Object.keys(missing);
      if (missingKeys.length > 0) {
        console.log(
          chalk.bold(
            `Did you install these dependencies? couldn't find these dependencies in your package.json.`,
          ),
        );
        for (const packageName of missingKeys) {
          console.log(chalk.yellow(`- ${packageName}`));
        }
        console.log('');
      }
      break;
    case 'tsconfig':
      for (const result of message.result) {
        console.log(chalk.bold(result.message));
        console.log(chalk.blueBright(JSON.stringify(result.fixer, null, 2)));
      }
      break;
  }
}
