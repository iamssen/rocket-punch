import fs from 'fs-extra';
import path from 'path';
import { build } from '../build';
import { exec } from '../utils/promisify';
import { copyTmpDirectory, createTmpDirectory } from '../utils/tmp';

describe('build()', () => {
  test('should basic build normally', async () => {
    const cwd: string = await copyTmpDirectory(path.join(process.cwd(), 'test/fixtures/basic'));
    const dist: string = await createTmpDirectory();

    await build({
      cwd,
      dist,
    });

    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();
  }, 100000);
  
  test('should js build normally', async () => {
    const cwd: string = await copyTmpDirectory(path.join(process.cwd(), 'test/fixtures/js'));
    const dist: string = await createTmpDirectory();
    //await exec(`open ${cwd}`);
    //await exec(`open ${dist}`);

    await build({
      cwd,
      dist,
    });

    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();
  }, 100000);

  test('should bundle build normally', async () => {
    const cwd: string = await copyTmpDirectory(path.join(process.cwd(), 'test/fixtures/bundle'));
    const dist: string = await createTmpDirectory();

    await exec(`npm install`, { cwd });
    //await exec(`open ${cwd}`);
    //await exec(`open ${dist}`);

    await build({
      cwd,
      dist,
    });

    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/icon.svg'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/icon.svg.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/icon.svg.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/test.txt'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/test.txt.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/test.txt.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/image.jpg'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/image.jpg.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/image.jpg.d.ts'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/data.yaml'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/data.yaml.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/data.yaml.d.ts'))).toBeTruthy();
  }, 100000);
});
