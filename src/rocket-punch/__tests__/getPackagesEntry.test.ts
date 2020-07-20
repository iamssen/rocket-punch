import { copyTmpDirectory } from '@ssen/tmp-directory';
import process from 'process';
import { PackageInfo } from 'rocket-punch';
import { getPackagesEntry } from 'rocket-punch/entry/getPackagesEntry';
import { getRootDependencies } from 'rocket-punch/package-json/getRootDependencies';
import { PackageJson } from 'type-fest';

describe('getPackagesEntry()', () => {
  test('should get packages entry', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(process.cwd(), `test/fixtures/rocket-punch/sample`);

    // Act
    const entry: Map<string, PackageInfo> = await getPackagesEntry({ cwd });
    const externalPackages: PackageJson.Dependency = await getRootDependencies({ cwd });

    // Assert
    expect(entry.get('a')?.module).toBe('commonjs');
    expect(entry.get('a')?.packageJson).toEqual({});
    expect(entry.get('a')?.compilerOptions).toEqual({});

    expect(entry.has('a')).toBeTruthy();
    expect(entry.has('b')).toBeTruthy();
    expect(entry.has('c')).toBeTruthy();
    expect('react' in externalPackages).toBeTruthy();
  });

  test('should get packages entry by @group/*', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(process.cwd(), `test/fixtures/rocket-punch/group-entry`);

    // Act
    const entry: Map<string, PackageInfo> = await getPackagesEntry({ cwd });
    const externalPackages: PackageJson.Dependency = await getRootDependencies({ cwd });

    // Assert
    expect(entry.get('@group/a')?.module).toBe('commonjs');
    expect(entry.get('@group/a')?.packageJson).toEqual({});
    expect(entry.get('@group/a')?.compilerOptions).toEqual({});

    expect(entry.has('@group/a')).toBeTruthy();
    expect(entry.has('@group/b')).toBeTruthy();
    expect(entry.has('@group/c')).toBeTruthy();
    expect('react' in externalPackages).toBeTruthy();
  });

  test('should get packageJson and compilerOptions', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      process.cwd(),
      `test/fixtures/rocket-punch/packages-package-json`,
    );

    // Act
    const entry: Map<string, PackageInfo> = await getPackagesEntry({ cwd });

    // Assert
    expect(entry.get('a')?.module).toBe('commonjs');
    expect(entry.get('a')?.packageJson['bin']['cli-a']).toBe('./bin/test.js');
    expect(entry.get('b')?.module).toBe('commonjs');
    expect(entry.get('b')?.packageJson['test']).toBe('hello world 1');
    expect(entry.get('b')?.compilerOptions['allowJs']).toBeTruthy();
    expect(entry.get('c')?.module).toBe('commonjs');
    expect(entry.get('c')?.packageJson['test']).toBe('hello world 2');

    expect(entry.has('a')).toBeTruthy();
    expect(entry.has('b')).toBeTruthy();
    expect(entry.has('c')).toBeTruthy();
  });
});
