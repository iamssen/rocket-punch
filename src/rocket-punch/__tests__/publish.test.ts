import { flatPackageName } from '@ssen/flat-package-name';
import { copyTmpDirectory, createTmpDirectory } from '@ssen/tmp-directory';
import path from 'path';
import { build } from 'rocket-punch/build';
import { publish, PublishMessages } from 'rocket-punch/publish';

describe('publish()', () => {
  test('should get exec commands', async () => {
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), 'test/fixtures/rocket-punch/publish'),
    );
    const dist: string = await createTmpDirectory();

    //await exec(`open ${dist}`);

    await build({
      cwd,
      dist,
      onMessage: async () => {},
    });

    const messages: PublishMessages[] = [];

    await publish({
      cwd,
      dist,
      skipSelection: true,
      onMessage: async (message) => {
        switch (message.type) {
          case 'exec':
            messages.push(message);
            break;
        }
      },
    });

    expect(messages[0].command).toContain(`cd "${path.join(dist, flatPackageName('@ssen-temp/a'))}"`);
    expect(messages[0].command).toContain(`npm publish --tag latest`);
    expect(messages[1].command).toContain(`cd "${path.join(dist, flatPackageName('@ssen-temp/b'))}"`);
    expect(messages[1].command).toContain(`npm publish --tag latest`);
    expect(messages[2].command).toContain(`cd "${path.join(dist, flatPackageName('@ssen-temp/c'))}"`);
    expect(messages[2].command).toContain(`npm publish --tag latest`);
  }, 10000);
});
