import { collectDependencies, collectScripts, collectTypeScript } from '@ssen/collect-dependencies';
import { rewriteSrcPath } from '@ssen/rewrite-src-path';
import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';
import { PackageInfo } from '../types';

describe('collectDependencies()', () => {
  test('should get all dependencies from typescript sources', async () => {
    const rootDir: string = path.join(process.cwd(), 'test/fixtures/collect-dependencies/ts');
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir,
      internalPackages: new Map<string, PackageInfo>([
        [
          '@ssen/tmp-directory',
          {
            name: '@ssen/tmp-directory',
            version: '0.1.0',
          },
        ],
      ]),
      externalPackages: require(path.join(rootDir, 'package.json')).dependencies,
      ...collectTypeScript,
    });

    expect('react' in dependencies).toBeTruthy();
    expect('rimraf' in dependencies).toBeTruthy();
    expect('tmp' in dependencies).toBeTruthy();
    expect('semver' in dependencies).toBeTruthy();
    expect('glob' in dependencies).toBeTruthy();

    expect('@ssen/tmp-directory' in dependencies).toBeTruthy();
  });

  test('should use default configs', async () => {
    const rootDir: string = path.join(process.cwd(), 'test/fixtures/collect-dependencies/ts');
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir,
      internalPackages: new Map<string, PackageInfo>([
        [
          '@ssen/tmp-directory',
          {
            name: '@ssen/tmp-directory',
            version: '0.1.0',
          },
        ],
      ]),
      externalPackages: require(path.join(rootDir, 'package.json')).dependencies,
    });

    expect('react' in dependencies).toBeTruthy();
    expect('rimraf' in dependencies).toBeTruthy();
    expect('tmp' in dependencies).toBeTruthy();
    expect('semver' in dependencies).toBeTruthy();
    expect('glob' in dependencies).toBeTruthy();

    expect('@ssen/tmp-directory' in dependencies).toBeTruthy();
  });

  test('should get all dependencies from sources', async () => {
    const rootDir: string = path.join(process.cwd(), 'test/fixtures/collect-dependencies/js');
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir,
      internalPackages: new Map<string, PackageInfo>([
        [
          '@ssen/tmp-directory',
          {
            name: '@ssen/tmp-directory',
            version: '0.1.0',
          },
        ],
      ]),
      externalPackages: require(path.join(rootDir, 'package.json')).dependencies,
      ...collectScripts,
    });

    expect('react' in dependencies).toBeTruthy();
    expect('rimraf' in dependencies).toBeTruthy();
    expect('tmp' in dependencies).toBeTruthy();
    expect('semver' in dependencies).toBeTruthy();
    expect('glob' in dependencies).toBeTruthy();

    expect('@ssen/tmp-directory' in dependencies).toBeTruthy();
  });

  test('should get all dependencies without self name', async () => {
    const rootDir: string = path.join(process.cwd(), 'test/fixtures/collect-dependencies/self-name');
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir,
      internalPackages: new Map<string, PackageInfo>([
        [
          '@ssen/tmp-directory',
          {
            name: '@ssen/tmp-directory',
            version: '0.1.0',
          },
        ],
        [
          'imports',
          {
            name: 'imports',
            version: '0.1.0',
          },
        ],
      ]),
      externalPackages: require(path.join(rootDir, 'package.json')).dependencies,
      selfNames: new Set(['imports']),
      ...collectScripts,
    });

    expect('react' in dependencies).toBeTruthy();
    expect('rimraf' in dependencies).toBeTruthy();
    expect('tmp' in dependencies).toBeTruthy();
    expect('semver' in dependencies).toBeTruthy();
    expect('glob' in dependencies).toBeTruthy();
    expect('imports' in dependencies).toBeFalsy();

    expect('@ssen/tmp-directory' in dependencies).toBeTruthy();
  });

  test('should can not get unspecified internal dependency', async () => {
    const rootDir: string = path.join(process.cwd(), 'test/fixtures/collect-dependencies/ts');
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir,
      internalPackages: new Map<string, PackageInfo>(),
      externalPackages: require(path.join(rootDir, 'package.json')).dependencies,
      checkUndefinedPackage: 'pass',
      ...collectTypeScript,
    });

    expect('@ssen/tmp-directory' in dependencies).toBeFalsy();
  });

  test('should throw error with unspecified internal dependency', async () => {
    const rootDir: string = path.join(process.cwd(), 'test/fixtures/collect-dependencies/ts');
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    await expect(() =>
      collectDependencies({
        rootDir,
        internalPackages: new Map<string, PackageInfo>(),
        externalPackages: require(path.join(rootDir, 'package.json')).dependencies,
        checkUndefinedPackage: 'error',
        ...collectTypeScript,
      }),
    ).rejects.toThrow();
  });

  test('should fix import paths', async () => {
    const rootDir: string = path.join(process.cwd(), 'test/fixtures/collect-dependencies/fix-import-path');
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir: path.join(rootDir, 'a'),
      internalPackages: new Map<string, PackageInfo>(
        ['b', 'c', 'd', 'e'].map((name) => [
          name,
          {
            name,
            version: '0.1.0',
          },
        ]),
      ),
      externalPackages: {},
      ...collectTypeScript,
      fixImportPath: ({ importPath, filePath }) =>
        rewriteSrcPath({
          rootDir,
          importPath,
          filePath,
        }),
    });

    expect('b' in dependencies).toBeTruthy();
  });
});
