import chalk from 'chalk';
import { ViewMessages } from '../params';

export async function viewMessageHandler(message: ViewMessages) {
  switch (message.type) {
    case 'view':
      console.log(
        `📦 ${chalk.bold(message.metadata.name)} <${
          message.packageConfig.version
        }@${message.packageConfig.tag}>`,
      );
      const tagList: string[] = Object.keys(message.tags);
      const maxLength: number = Math.max(...tagList.map((tag) => tag.length));

      tagList.forEach((tag) => {
        console.log(
          message.packageConfig.tag === tag
            ? chalk.blueBright(
                `${tag.padEnd(maxLength, ' ')} : ${message.tags[tag]} `,
              ) + '*'
            : chalk.gray(
                `${tag.padEnd(maxLength, ' ')} : ${message.tags[tag]}`,
              ),
        );
      });
      console.log('');
      break;
  }
}
