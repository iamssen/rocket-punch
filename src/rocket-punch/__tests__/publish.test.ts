import { flatPackageName } from '@ssen/flat-package-name';
import { copyTmpDirectory, createTmpDirectory } from '@ssen/tmp-directory';
import path from 'path';
import process from 'process';
import { build, publish, PublishMessages } from 'rocket-punch';

describe('publish()', () => {
  test('should get exec commands', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), 'test/fixtures/rocket-punch/publish'),
    );
    const dist: string = await createTmpDirectory();

    //await exec(`open ${dist}`);

    // Arrange
    // build fixture
    await build({
      cwd,
      dist,
      entry: {
        '@ssen-temp/*': {
          version: '0.1.0',
        },
      },
      onMessage: async () => {},
    });

    const messages: PublishMessages[] = [];

    // Act
    await publish({
      cwd,
      dist,
      entry: {
        '@ssen-temp/*': {
          version: '0.1.0',
        },
      },
      skipSelection: true,
      onMessage: async (message) => {
        switch (message.type) {
          case 'exec':
            messages.push(message);
            break;
        }
      },
    });

    // Assert
    expect(messages[0].command).toContain(`cd "${path.join(dist, flatPackageName('@ssen-temp/a'))}"`);
    expect(messages[0].command).toContain(`npm publish --tag latest`);
    expect(messages[1].command).toContain(`cd "${path.join(dist, flatPackageName('@ssen-temp/b'))}"`);
    expect(messages[1].command).toContain(`npm publish --tag latest`);
    expect(messages[2].command).toContain(`cd "${path.join(dist, flatPackageName('@ssen-temp/c'))}"`);
    expect(messages[2].command).toContain(`npm publish --tag latest`);
  });
});
