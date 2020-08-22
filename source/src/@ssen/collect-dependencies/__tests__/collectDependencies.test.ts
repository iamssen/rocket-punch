import {
  collectDependencies,
  collectScripts,
  collectTypeScript,
  PackageInfo,
} from '@ssen/collect-dependencies';
import { rewriteSrcPath } from '@ssen/rewrite-src-path';
import fs from 'fs-extra';
import path from 'path';
import process from 'process';
import { PackageJson } from 'type-fest';

describe('collectDependencies()', () => {
  test('should get all dependencies from typescript sources', async () => {
    // Arrange : create temporary fixture
    const rootDir: string = path.join(process.cwd(), 'test/fixtures/collect-dependencies/ts');
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    // Arrange : create test data
    const internalPackages: Map<string, PackageInfo> = new Map([
      [
        '@ssen/tmp-directory',
        {
          name: '@ssen/tmp-directory',
          version: '0.1.0',
        },
      ],
    ]);
    const externalPackages: PackageJson.Dependency = require(path.join(rootDir, 'package.json')).dependencies;

    // Act
    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir,
      internalPackages,
      externalPackages,
      ...collectTypeScript,
    });

    // Assert
    // imported from externalPackages
    expect('react' in dependencies).toBeTruthy();
    expect('rimraf' in dependencies).toBeTruthy();
    expect('tmp' in dependencies).toBeTruthy();
    expect('semver' in dependencies).toBeTruthy();
    expect('glob' in dependencies).toBeTruthy();
    // imported from internalPackages
    expect('@ssen/tmp-directory' in dependencies).toBeTruthy();
  });

  test('should work with default config', async () => {
    // Arrange : create temporary fixture
    const rootDir: string = path.join(process.cwd(), 'test/fixtures/collect-dependencies/ts');
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    // Arrange : create test data
    const internalPackages: Map<string, PackageInfo> = new Map<string, PackageInfo>([
      [
        '@ssen/tmp-directory',
        {
          name: '@ssen/tmp-directory',
          version: '0.1.0',
        },
      ],
    ]);
    const externalPackages: PackageJson.Dependency = require(path.join(rootDir, 'package.json')).dependencies;

    // Act
    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir,
      internalPackages,
      externalPackages,
    });

    // Assert
    // imported from externalPackages
    expect('react' in dependencies).toBeTruthy();
    expect('rimraf' in dependencies).toBeTruthy();
    expect('tmp' in dependencies).toBeTruthy();
    expect('semver' in dependencies).toBeTruthy();
    expect('glob' in dependencies).toBeTruthy();
    // imported from internalPackages
    expect('@ssen/tmp-directory' in dependencies).toBeTruthy();
  });

  test('should get all dependencies from javascript sources', async () => {
    // Arrange : create temporary fixture
    const rootDir: string = path.join(process.cwd(), 'test/fixtures/collect-dependencies/js');
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    // Arrange : create test data
    const internalPackages: Map<string, PackageInfo> = new Map<string, PackageInfo>([
      [
        '@ssen/tmp-directory',
        {
          name: '@ssen/tmp-directory',
          version: '0.1.0',
        },
      ],
    ]);
    const externalPackages: PackageJson.Dependency = require(path.join(rootDir, 'package.json')).dependencies;

    // Act
    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir,
      internalPackages,
      externalPackages,
      ...collectScripts,
    });

    // Assert
    // imported from externalPackages
    expect('react' in dependencies).toBeTruthy();
    expect('rimraf' in dependencies).toBeTruthy();
    expect('tmp' in dependencies).toBeTruthy();
    expect('semver' in dependencies).toBeTruthy();
    expect('glob' in dependencies).toBeTruthy();
    // imported from internalPackages
    expect('@ssen/tmp-directory' in dependencies).toBeTruthy();
  });

  test('should get all dependencies without self name', async () => {
    // Arrange : create temporary fixture
    const rootDir: string = path.join(process.cwd(), 'test/fixtures/collect-dependencies/self-name');
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    // Arrange : create test data
    const internalPackages: Map<string, PackageInfo> = new Map<string, PackageInfo>([
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
    ]);
    const externalPackages: PackageJson.Dependency = require(path.join(rootDir, 'package.json')).dependencies;
    const selfNames: Set<string> = new Set<string>(['imports']);

    // Act
    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir,
      internalPackages,
      externalPackages,
      selfNames,
      ...collectScripts,
    });

    // Assert
    // imported from externalPackages
    expect('react' in dependencies).toBeTruthy();
    expect('rimraf' in dependencies).toBeTruthy();
    expect('tmp' in dependencies).toBeTruthy();
    expect('semver' in dependencies).toBeTruthy();
    expect('glob' in dependencies).toBeTruthy();
    // `imports` is self name when the build of `imports`
    // `import {} from 'imports'` would be ignored
    expect('imports' in dependencies).toBeFalsy();
    // imported from internalPackages
    expect('@ssen/tmp-directory' in dependencies).toBeTruthy();
  });

  test('should can not get unspecified internal dependency', async () => {
    // Arrange : create temporary fixture
    const rootDir: string = path.join(process.cwd(), 'test/fixtures/collect-dependencies/ts');
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    // Arrange : create test data
    const internalPackages: Map<string, PackageInfo> = new Map<string, PackageInfo>();
    const externalPackages: PackageJson.Dependency = require(path.join(rootDir, 'package.json')).dependencies;
    const checkUndefinedPackage: 'pass' | 'error' = 'pass';

    // Act
    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir,
      internalPackages,
      externalPackages,
      checkUndefinedPackage,
      ...collectTypeScript,
    });

    // Assert
    // missing dependency will not throw an error just will be ignored
    expect('@ssen/tmp-directory' in dependencies).toBeFalsy();
  });

  test('should throw error with unspecified internal dependency', async () => {
    // Arrange : create temporary fixture
    const rootDir: string = path.join(process.cwd(), 'test/fixtures/collect-dependencies/ts');
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    // Arrange : create test data
    const internalPackages: Map<string, PackageInfo> = new Map<string, PackageInfo>();
    const externalPackages: PackageJson.Dependency = require(path.join(rootDir, 'package.json')).dependencies;
    const checkUndefinedPackage: 'pass' | 'error' = 'error';

    // Act
    // it will not find '@ssen/tmp-directory' package
    // because of the internalPackages does not have that package.
    // "checkUndefinedPackge: error" option will throw error when find undefined package.
    await expect(() =>
      collectDependencies({
        rootDir,
        internalPackages,
        externalPackages,
        checkUndefinedPackage,
        ...collectTypeScript,
      }),
    ).rejects.toThrow();
  });

  test('should fix import paths', async () => {
    // Arrange : create temporary fixture
    const rootDir: string = path.join(process.cwd(), 'test/fixtures/collect-dependencies/fix-import-path');
    expect(fs.statSync(rootDir).isDirectory()).toBeTruthy();

    // Arrange : create test data
    const internalPackages: Map<string, PackageInfo> = new Map<string, PackageInfo>(
      ['b', 'c', 'd', 'e'].map((name) => [
        name,
        {
          name,
          version: '0.1.0',
        },
      ]),
    );
    const externalPackages: PackageJson.Dependency = {};
    const fixImportPath = ({ importPath, filePath }: { importPath: string; filePath: string }) => {
      return rewriteSrcPath({
        rootDir,
        importPath,
        filePath,
      });
    };

    // Act
    const dependencies: PackageJson.Dependency = await collectDependencies({
      rootDir: path.join(rootDir, 'a'),
      internalPackages,
      externalPackages,
      ...collectTypeScript,
      fixImportPath,
    });

    // Assert
    // `import {} from '../b'` is fixed to `import {} from 'b'` by fixImportPath option
    expect('b' in dependencies).toBeTruthy();
  });
});
