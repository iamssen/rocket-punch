import { exec } from '@ssen/promised';
import { PublishMessages } from '../publish';
import chalk from 'chalk';

export async function publishMessageHandler(message: PublishMessages) {
  switch (message.type) {
    case 'exec':
      console.log(chalk.bold(message.command));
      console.log('');
      const { stderr, stdout } = await exec(message.command, { encoding: 'utf8' });
      console.log(stdout);
      console.error(chalk.grey(stderr));
      break;
  }
}
