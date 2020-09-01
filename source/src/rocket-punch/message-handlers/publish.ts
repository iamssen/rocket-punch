import { exec } from '@ssen/promised';
import chalk from 'chalk';
import { PublishMessages } from '../params';

export async function publishMessageHandler(message: PublishMessages) {
  switch (message.type) {
    case 'exec':
      console.log(chalk.bold(message.command));
      console.log('');
      const { stderr, stdout } = await exec(message.command, {
        encoding: 'utf8',
      });
      console.log(stdout);
      console.error(chalk.grey(stderr));
      break;
  }
}
