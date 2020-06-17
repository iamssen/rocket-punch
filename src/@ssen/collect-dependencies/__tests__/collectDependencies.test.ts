import { collectDependencies, collectScripts, collectTypeScript } from '@ssen/collect-dependencies';
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
      ...collectTypeScript,
    });

    expect('@ssen/tmp-directory' in dependencies).toBeFalsy();
  });
  
  test.todo('should fix import paths');
});
