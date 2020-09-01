import fs from 'fs-extra';
import path from 'path';
import process from 'process';
import { copyTmpDirectory, createTmpDirectory } from '../';

describe('tmp-directory', () => {
  test('should get a created tmp directory', async () => {
    // Arrange
    const dir: string = await createTmpDirectory();

    // Assert
    expect(fs.statSync(dir).isDirectory()).toBeTruthy();
  });

  test('should get a copied tmp directory', async () => {
    // Arrange
    const source: string = path.join(
      process.cwd(),
      'test/fixtures/rocket-punch/basic',
    );
    expect(fs.statSync(source).isDirectory()).toBeTruthy();

    // Act
    const dir: string = await copyTmpDirectory(source);

    // Assert
    expect(fs.statSync(dir).isDirectory()).toBeTruthy();

    expect(fs.existsSync(path.join(dir, 'src/a/index.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dir, 'src/b/index.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dir, 'src/c/index.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dir, '.packages.yaml'))).toBeTruthy();
    expect(fs.existsSync(path.join(dir, 'package.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(dir, 'tsconfig.json'))).toBeTruthy();
  });
});
