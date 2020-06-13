import chalk from 'chalk';
import { ViewMessages } from '../view';

export async function viewMessageHandler(message: ViewMessages) {
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
}
