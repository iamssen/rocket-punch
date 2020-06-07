import { exec } from '@ssen/promised';
import { PublishMessages } from 'rocket-punch/publish';

export async function publishMessageHandler(message: PublishMessages) {
  switch (message.type) {
    case 'exec':
      console.log(`npm publish ${message.command}`);
      console.log('');
      const { stderr, stdout } = await exec(message.command, { encoding: 'utf8' });
      console.log(stdout);
      console.error(stderr);
      break;
  }
}
