import { copyTmpDirectory, createTmpDirectory } from '@ssen/tmp-directory';
import fs from 'fs-extra';
import path from 'path';
import process from 'process';
import { build, PackageConfig, PackageInfo } from 'rocket-punch';
import { readEntry } from 'rocket-punch/entry/readEntry';
import { readPackages } from 'rocket-punch/entry/readPackages';
import { describe, test, expect } from 'vitest';

describe('build()', () => {
  test('should succeed in basic build', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), 'test/fixtures/rocket-punch/basic'),
    );
    const dist: string = await createTmpDirectory();

    //await exec(`open ${dist}`);

    // Act
    // build {cwd} to {dist}
    await build({
      cwd,
      dist,
      entry: {
        a: { version: '0.1.0' },
        b: { version: '0.1.0' },
        c: { version: '0.1.0' },
      },
      onMessage: async () => {},
    });

    // Assert
    // check exists build output files
    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/_commonjs/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/_commonjs/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/_commonjs/index.js'))).toBeTruthy();
  });

  test.each(['minimum-config', 'minimum-config-cra', 'minimum-config-js-cra'])(
    'should build with minimum config with "%s"',
    async (dir: string) => {
      // Arrange
      const cwd: string = await copyTmpDirectory(
        path.join(process.cwd(), `test/fixtures/rocket-punch/${dir}`),
      );
      const dist: string = await createTmpDirectory();

      // Act
      // build {cwd} to {dist}
      await build({
        cwd,
        dist,
        entry: {
          a: { version: '0.1.0' },
          b: { version: '0.1.0' },
          c: { version: '0.1.0' },
        },
        onMessage: async () => {},
      });

      // Assert
      // check exists build output files
      expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
      expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
      expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
      expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
      expect(fs.existsSync(path.join(dist, 'c/index.js'))).toBeTruthy();
      expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();
      expect(
        fs.existsSync(path.join(dist, 'a/_commonjs/index.js')),
      ).toBeTruthy();
      expect(
        fs.existsSync(path.join(dist, 'b/_commonjs/index.js')),
      ).toBeTruthy();
      expect(
        fs.existsSync(path.join(dist, 'c/_commonjs/index.js')),
      ).toBeTruthy();
    },
  );

  test('should not print warnings on current package name import', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      path.join(
        process.cwd(),
        'test/fixtures/rocket-punch/current-package-name-import',
      ),
    );
    const dist: string = await createTmpDirectory();

    // Act
    // build {cwd} to {dist}
    await build({
      cwd,
      dist,
      entry: {
        a: { version: '0.1.0' },
      },
      onMessage: async (message) => {
        if (message.type === 'tsc') {
          expect(message.diagnostics.length).toBe(0);
        }
      },
    });

    // Assert
    // check exists build output files
    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/_commonjs/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/b/c.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/b/c.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/_commonjs/b/c.js'))).toBeTruthy();
  });

  test('should build with exports', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), 'test/fixtures/rocket-punch/exports'),
    );

    // Act
    // read .packages.yaml
    const packages: Record<string, string | PackageConfig> = readEntry({ cwd });
    const entry: Map<string, PackageInfo> = await readPackages({
      cwd,
      sourceRoot: 'src',
      entry: packages,
    });

    // Assert
    // check module property of package
    expect(entry.get('a')?.exports).toEqual({
      main: 'commonjs',
      commonjs: true,
      module: true,
    });
    expect(entry.get('b')?.exports).toEqual({
      main: 'commonjs',
      commonjs: true,
      module: false,
    });
    expect(entry.get('c')?.exports).toEqual({
      main: 'module',
      commonjs: false,
      module: true,
    });

    // Arrange
    const dist: string = await createTmpDirectory();

    // Act
    await build({
      cwd,
      dist,
      entry: packages,
      onMessage: async () => {},
    });

    // Assert
    // check exists build output files
    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/_module/index.js'))).toBeTruthy();

    expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/_commonjs'))).toBeFalsy();
    expect(fs.existsSync(path.join(dist, 'b/_module'))).toBeFalsy();

    expect(fs.existsSync(path.join(dist, 'c/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/_commonjs'))).toBeFalsy();
    expect(fs.existsSync(path.join(dist, 'c/_module'))).toBeFalsy();

    // Assert
    // check source code is made in commonjs
    expect(
      /exports.a/g.test(fs.readFileSync(path.join(dist, 'a/index.js'), 'utf8')),
    ).toBeTruthy();
    expect(
      /exports.b/g.test(fs.readFileSync(path.join(dist, 'b/index.js'), 'utf8')),
    ).toBeTruthy();
    // check source code is made in esm
    expect(
      /export function c/g.test(
        fs.readFileSync(path.join(dist, 'c/index.js'), 'utf8'),
      ),
    ).toBeTruthy();
  });

  test('should local-paths build normally', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), 'test/fixtures/rocket-punch/local-paths'),
    );
    const dist: string = await createTmpDirectory();
    //await exec(`open ${cwd}`);
    //await exec(`open ${dist}`);

    // Act
    await build({
      cwd,
      dist,
      entry: {
        a: { version: '0.1.0' },
        b: { version: '0.1.0' },
        c: { version: '0.1.0' },
      },
      onMessage: async () => {},
    });

    // Assert
    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/x/y/z.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/x/y/z.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/_commonjs/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/_commonjs/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/_commonjs/x/y/z.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/_commonjs/index.js'))).toBeTruthy();
  });

  test('should js build normally', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), 'test/fixtures/rocket-punch/js'),
    );
    const dist: string = await createTmpDirectory();
    //await exec(`open ${cwd}`);
    //await exec(`open ${dist}`);

    // Act
    await build({
      cwd,
      dist,
      entry: {
        a: { version: '0.1.0' },
        b: { version: '0.1.0' },
        c: { version: '0.1.0' },
      },
      onMessage: async () => {},
    });

    // Assert
    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/_commonjs/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/_commonjs/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/_commonjs/index.js'))).toBeTruthy();
  });

  test('should bundle build normally', async () => {
    // Arrrange
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), 'test/fixtures/rocket-punch/bundle'),
    );
    const dist: string = await createTmpDirectory();

    //await exec(`npm install`, { cwd });
    //await exec(`open ${cwd}`);
    //await exec(`open ${dist}`);

    // Act
    await build({
      cwd,
      dist,
      entry: {
        a: { version: '0.1.0' },
        b: { version: '0.1.0' },
        c: { version: '0.1.0' },
      },
      onMessage: async () => {},
    });

    // Assert
    // original svg, txt, jpg, yaml files are not made in output.
    // there will be created {file}.js files.
    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/icon.svg'))).toBeFalsy();
    expect(fs.existsSync(path.join(dist, 'a/icon.svg.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/icon.svg.d.ts'))).toBeTruthy();
    expect(
      fs.existsSync(path.join(dist, 'a/icon-not-bundle.svg')),
    ).toBeTruthy();
    expect(
      fs.existsSync(path.join(dist, 'a/_commonjs/icon.svg.js')),
    ).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/_commonjs/index.js'))).toBeTruthy();

    expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/test.txt'))).toBeFalsy();
    expect(fs.existsSync(path.join(dist, 'b/test.txt.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/test.txt.d.ts'))).toBeTruthy();
    expect(
      fs.existsSync(path.join(dist, 'b/test-not-bundle.txt')),
    ).toBeTruthy();
    expect(
      fs.existsSync(path.join(dist, 'b/_commonjs/test.txt.js')),
    ).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/_commonjs/index.js'))).toBeTruthy();

    expect(fs.existsSync(path.join(dist, 'c/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/image.jpg'))).toBeFalsy();
    expect(fs.existsSync(path.join(dist, 'c/image.jpg.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/image.jpg.d.ts'))).toBeTruthy();
    expect(
      fs.existsSync(path.join(dist, 'c/image-not-bundle.jpg')),
    ).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/data.yaml'))).toBeFalsy();
    expect(fs.existsSync(path.join(dist, 'c/data.yaml.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/data.yaml.d.ts'))).toBeTruthy();
    expect(
      fs.existsSync(path.join(dist, 'c/data-not-bundle.yaml')),
    ).toBeTruthy();
    expect(
      fs.existsSync(path.join(dist, 'c/_commonjs/image.jpg.js')),
    ).toBeTruthy();
    expect(
      fs.existsSync(path.join(dist, 'c/_commonjs/data.yaml.js')),
    ).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/_commonjs/index.js'))).toBeTruthy();
  });

  test('should build sample directory', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      process.cwd(),
      'test/fixtures/rocket-punch/sample',
    );
    const dist: string = path.join(cwd, 'out/packages');

    //await exec(`npm install`, { cwd });
    //await exec(`open ${cwd}`);

    // Act
    await build({
      cwd,
      dist,
      entry: {
        a: {
          version: '0.1.0',
          tag: 'latest',
        },
        b: {
          version: '0.1.0',
          tag: 'latest',
        },
        c: {
          version: '0.1.0',
          tag: 'latest',
        },
      },
      onMessage: async () => {},
    });

    // Assert
    expect(fs.existsSync(path.join(dist, 'a/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/package.json'))).toBeTruthy();

    expect(fs.existsSync(path.join(dist, 'b/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/package.json'))).toBeTruthy();

    expect(fs.existsSync(path.join(dist, 'c/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/package.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/public/test.txt'))).toBeTruthy();

    expect(fs.existsSync(path.join(dist, 'a/_commonjs/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/_commonjs/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/_commonjs/index.js'))).toBeTruthy();
  });

  test('should fail build by strict mode', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      process.cwd(),
      'test/fixtures/rocket-punch/strict',
    );
    const dist: string = path.join(cwd, 'out/packages');

    //await exec(`npm install`, { cwd });

    // Asset
    await expect(
      build({
        cwd,
        strict: true,
        dist,
        entry: {
          a: {
            version: '0.1.0',
            tag: 'latest',
          },
          b: {
            version: '0.1.0',
            tag: 'latest',
          },
          c: {
            version: '0.1.0',
            tag: 'latest',
          },
        },
        onMessage: async () => {},
      }),
    ).rejects.toThrowError();
  });

  test('should transform package.json', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      process.cwd(),
      `test/fixtures/rocket-punch/transform-package-json`,
    );
    const dist: string = path.join(cwd, 'out/packages');

    //await exec(`npm install`, { cwd });
    //await exec(`open ${cwd}`);

    // Act
    await build({
      cwd,
      dist,
      entry: {
        a: {
          version: '0.1.0',
          tag: 'latest',
        },
        b: {
          version: '0.1.0',
          tag: 'latest',
        },
        c: {
          version: '0.1.0',
          tag: 'latest',
        },
      },
      transformPackageJson: (packageName) => (computedPackageJson) => {
        if (packageName === 'b') {
          return {
            ...computedPackageJson,
            keywords: ['hello'],
          };
        }

        return computedPackageJson;
      },
      onMessage: async () => {},
    });

    // Assert
    expect(fs.existsSync(path.join(dist, 'a/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/package.json'))).toBeTruthy();

    expect(fs.existsSync(path.join(dist, 'b/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/package.json'))).toBeTruthy();

    expect(fs.existsSync(path.join(dist, 'c/README.md'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/package.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/public/test.txt'))).toBeTruthy();

    // Assert
    // b/package.json has "hello" field
    // that package.json transformed by .package.ts file
    expect(fs.readJsonSync(path.join(dist, 'b/package.json')).keywords).toEqual(
      ['hello'],
    );
  });
});
