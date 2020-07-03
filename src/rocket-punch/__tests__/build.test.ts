import { exec } from '@ssen/promised';
import { copyTmpDirectory, createTmpDirectory } from '@ssen/tmp-directory';
import fs from 'fs-extra';
import path from 'path';
import { build } from 'rocket-punch';
import { getPackagesEntry } from 'rocket-punch/entry/getPackagesEntry';
import { PackageInfo } from 'rocket-punch/types';

describe('build()', () => {
  test('should basic build normally', async () => {
    const cwd: string = await copyTmpDirectory(path.join(process.cwd(), 'test/fixtures/rocket-punch/basic'));
    const dist: string = await createTmpDirectory();

    //await exec(`open ${dist}`);

    await build({
      cwd,
      dist,
      onMessage: async () => {},
    });

    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();
  }, 100000);

  test.each(['minimum-config', 'minimum-config-cra', 'minimum-config-js-cra'])(
    'should build with minimum config with "%s"',
    async (dir: string) => {
      const cwd: string = await copyTmpDirectory(
        path.join(process.cwd(), `test/fixtures/rocket-punch/${dir}`),
      );
      const dist: string = await createTmpDirectory();

      await build({
        cwd,
        dist,
        onMessage: async () => {},
      });

      expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
      expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
      expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
      expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
      expect(fs.existsSync(path.join(dist, 'c/index.js'))).toBeTruthy();
      expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();
    },
    100000,
  );

  test('should transform import paths', async () => {
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), 'test/fixtures/rocket-punch/import-path-rewrite'),
    );
    const dist: string = await createTmpDirectory();

    //await exec(`open ${dist}`);

    await build({
      cwd,
      dist,
      onMessage: async () => {},
    });

    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();
  }, 100000);

  test('should build with module types', async () => {
    const cwd: string = await copyTmpDirectory(path.join(process.cwd(), 'test/fixtures/rocket-punch/module'));
    const entry: Map<string, PackageInfo> = await getPackagesEntry({ cwd });

    expect(entry.get('a')?.module).toBe('commonjs');
    expect(entry.get('b')?.module).toBe('commonjs');
    expect(entry.get('c')?.module).toBe('esm');

    const dist: string = await createTmpDirectory();

    await build({
      cwd,
      dist,
      onMessage: async () => {},
    });

    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();

    expect(/exports.a/g.test(fs.readFileSync(path.join(dist, 'a/index.js'), 'utf8'))).toBeTruthy();
    expect(/exports.b/g.test(fs.readFileSync(path.join(dist, 'b/index.js'), 'utf8'))).toBeTruthy();
    expect(/export function c/g.test(fs.readFileSync(path.join(dist, 'c/index.js'), 'utf8'))).toBeTruthy();
  }, 100000);

  test('should local-paths build normally', async () => {
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), 'test/fixtures/rocket-punch/local-paths'),
    );
    const dist: string = await createTmpDirectory();
    //await exec(`open ${cwd}`);
    //await exec(`open ${dist}`);

    await build({
      cwd,
      dist,
      onMessage: async () => {},
    });

    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/x/y/z.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/x/y/z.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();
  }, 100000);

  test('should js build normally', async () => {
    const cwd: string = await copyTmpDirectory(path.join(process.cwd(), 'test/fixtures/rocket-punch/js'));
    const dist: string = await createTmpDirectory();
    //await exec(`open ${cwd}`);
    //await exec(`open ${dist}`);

    await build({
      cwd,
      dist,
      onMessage: async () => {},
    });

    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();
  }, 100000);

  test('should bundle build normally', async () => {
    const cwd: string = await copyTmpDirectory(path.join(process.cwd(), 'test/fixtures/rocket-punch/bundle'));
    const dist: string = await createTmpDirectory();

    await exec(`npm install`, { cwd });
    //await exec(`open ${cwd}`);
    //await exec(`open ${dist}`);

    await build({
      cwd,
      dist,
      onMessage: async () => {},
    });

    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/icon.svg'))).toBeFalsy();
    expect(fs.existsSync(path.join(dist, 'a/icon.svg.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/icon.svg.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/icon-not-bundle.svg'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/test.txt'))).toBeFalsy();
    expect(fs.existsSync(path.join(dist, 'b/test.txt.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/test.txt.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/test-not-bundle.txt'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/image.jpg'))).toBeFalsy();
    expect(fs.existsSync(path.join(dist, 'c/image.jpg.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/image.jpg.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/image-not-bundle.jpg'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/data.yaml'))).toBeFalsy();
    expect(fs.existsSync(path.join(dist, 'c/data.yaml.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/data.yaml.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/data-not-bundle.yaml'))).toBeTruthy();
  }, 100000);

  test.each(['sample', 'transform-package-json'])(
    'should build packages normally with %s',
    async (dir: string) => {
      const cwd: string = await copyTmpDirectory(process.cwd(), `test/fixtures/rocket-punch/${dir}`);
      const dist: string = path.join(cwd, 'dist');

      await exec(`npm install`, { cwd });
      //await exec(`open ${cwd}`);

      await build({
        cwd,
        dist,
        onMessage: async () => {},
      });

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

      switch (dir) {
        case 'transform-package-json':
          expect(fs.readJsonSync(path.join(dist, 'b/package.json')).keywords).toEqual(['hello']);
          break;
      }
    },
    100000,
  );
});
