import { copyTmpDirectory } from '@ssen/tmp-directory';
import process from 'process';
import { PackageInfo } from 'rocket-punch';
import { readEntry } from 'rocket-punch/entry/readEntry';
import { readPackages } from 'rocket-punch/entry/readPackages';
import { getRootDependencies } from 'rocket-punch/package-json/getRootDependencies';
import { PackageJson } from 'type-fest';

describe('getPackagesEntry()', () => {
  test('should get packages entry', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      process.cwd(),
      `test/fixtures/rocket-punch/sample`,
    );

    // Act
    const packages: Map<string, PackageInfo> = await readPackages({
      cwd,
      sourceRoot: 'src',
      entry: readEntry({ cwd }),
    });
    const externalPackages: PackageJson.Dependency = await getRootDependencies({
      cwd,
    });

    // Assert
    expect(packages.get('a')?.exports).toEqual({
      main: 'module',
      module: true,
      commonjs: true,
    });
    expect(packages.get('a')?.packageJson).toEqual({});
    expect(packages.get('a')?.compilerOptions).toEqual({});

    expect(packages.has('a')).toBeTruthy();
    expect(packages.has('b')).toBeTruthy();
    expect(packages.has('c')).toBeTruthy();
    expect('react' in externalPackages).toBeTruthy();
  });

  test('should get packages entry by @group/*', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      process.cwd(),
      `test/fixtures/rocket-punch/group-entry`,
    );

    // Act
    const packages: Map<string, PackageInfo> = await readPackages({
      cwd,
      sourceRoot: 'src',
      entry: readEntry({ cwd }),
    });
    const externalPackages: PackageJson.Dependency = await getRootDependencies({
      cwd,
    });

    // Assert
    expect(packages.get('@group/a')?.exports).toEqual({
      main: 'module',
      module: true,
      commonjs: true,
    });
    expect(packages.get('@group/a')?.packageJson).toEqual({});
    expect(packages.get('@group/a')?.compilerOptions).toEqual({});

    expect(packages.has('@group/a')).toBeTruthy();
    expect(packages.has('@group/b')).toBeTruthy();
    expect(packages.has('@group/c')).toBeTruthy();
    expect('react' in externalPackages).toBeTruthy();
  });

  test('should get packageJson and compilerOptions', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      process.cwd(),
      `test/fixtures/rocket-punch/packages-package-json`,
    );

    // Act
    const packages: Map<string, PackageInfo> = await readPackages({
      cwd,
      sourceRoot: 'src',
      entry: readEntry({ cwd }),
    });

    // Assert
    expect(packages.get('a')?.exports).toEqual({
      main: 'module',
      module: true,
      commonjs: true,
    });
    expect(packages.get('a')?.packageJson.bin).toMatchObject({
      'cli-a': './bin/test.js',
    });
    expect(packages.get('b')?.exports).toEqual({
      main: 'module',
      module: true,
      commonjs: true,
    });
    expect(packages.get('b')?.packageJson.author).toBe('hello world 1');
    expect(packages.get('b')?.compilerOptions['allowJs']).toBeTruthy();
    expect(packages.get('c')?.exports).toEqual({
      main: 'module',
      module: true,
      commonjs: true,
    });
    expect(packages.get('c')?.packageJson.author).toBe('hello world 2');

    expect(packages.has('a')).toBeTruthy();
    expect(packages.has('b')).toBeTruthy();
    expect(packages.has('c')).toBeTruthy();
  });
});
