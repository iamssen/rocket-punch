import { flatPackageName } from '@ssen/flat-package-name';
import { copyTmpDirectory, createTmpDirectory } from '@ssen/tmp-directory';
import path from 'path';
import process from 'process';
import { build, PackageConfig, publish, PublishMessages } from 'rocket-punch';

describe('publish()', () => {
  test('should get exec commands', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), 'test/fixtures/rocket-punch/publish'),
    );
    const dist: string = await createTmpDirectory();
    const entry: Record<string, string | PackageConfig> = {
      '@ssen-temp/*': {
        version: '0.1.0',
      },
    };

    //await exec(`open ${dist}`);

    // Arrange
    // build fixture
    await build({
      cwd,
      dist,
      entry,
      onMessage: async () => {},
    });

    const messages: PublishMessages[] = [];

    // Act
    await publish({
      cwd,
      dist,
      entry,
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

  test('should work access and registry params', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), 'test/fixtures/rocket-punch/publish'),
    );
    const dist: string = await createTmpDirectory();
    const entry: Record<string, string | PackageConfig> = {
      '@ssen-temp/a': {
        version: '0.1.0',
      },
      '@ssen-temp/b': {
        version: '0.1.0',
        access: 'public',
      },
      '@ssen-temp/c': {
        version: '0.1.0',
        registry: 'http://localhost:9876',
      },
    };

    // Arrange
    // build fixture
    await build({
      cwd,
      dist,
      entry,
      onMessage: async () => {},
    });

    const messages: PublishMessages[] = [];

    // Act
    await publish({
      cwd,
      dist,
      entry,
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
    expect(messages[1].command).toContain(`npm publish --tag latest --access public`);
    expect(messages[2].command).toContain(`cd "${path.join(dist, flatPackageName('@ssen-temp/c'))}"`);
    expect(messages[2].command).toContain(`npm publish --tag latest --registry "http://localhost:9876"`);
  });

  test('should force overwrite the package info by command line parameters', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), 'test/fixtures/rocket-punch/publish'),
    );
    const dist: string = await createTmpDirectory();
    const entry: Record<string, string | PackageConfig> = {
      '@ssen-temp/a': {
        version: '0.1.0',
      },
      '@ssen-temp/b': {
        version: '0.1.0',
        access: 'public',
      },
      '@ssen-temp/c': {
        version: '0.1.0',
        registry: 'http://localhost:9876',
      },
    };

    // Arrange
    // build fixture
    await build({
      cwd,
      dist,
      entry,
      onMessage: async () => {},
    });

    const messages: PublishMessages[] = [];

    // Act
    await publish({
      cwd,
      dist,
      entry,
      access: 'private',
      tag: 'canary',
      registry: 'http://127.0.0.1',
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
    expect(messages[0].command).toContain(
      `npm publish --tag canary --access private --registry "http://127.0.0.1"`,
    );
    expect(messages[1].command).toContain(`cd "${path.join(dist, flatPackageName('@ssen-temp/b'))}"`);
    expect(messages[1].command).toContain(
      `npm publish --tag canary --access private --registry "http://127.0.0.1"`,
    );
    expect(messages[2].command).toContain(`cd "${path.join(dist, flatPackageName('@ssen-temp/c'))}"`);
    expect(messages[2].command).toContain(
      `npm publish --tag canary --access private --registry "http://127.0.0.1"`,
    );
  });
});
