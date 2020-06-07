import path from 'path';
import { getRootDependencies } from 'rocket-punch/package-json/getRootDependencies';
import { PackageJson } from 'type-fest';

describe('getRootDependencies()', () => {
  test('should get root dependencies', async () => {
    const deps: PackageJson.Dependency = await getRootDependencies({
      cwd: path.join(process.cwd(), `test/fixtures/rocket-punch/sample`),
    });

    expect(deps['react']).not.toBeUndefined();
    expect(deps['react-app-polyfill']).not.toBeUndefined();
    expect(deps['react-dom']).not.toBeUndefined();
    expect(deps['@types/react']).not.toBeUndefined();
    expect(deps['@types/react-dom']).not.toBeUndefined();
    expect(deps['@types/webpack-env']).not.toBeUndefined();
  });

  test('should throw error if there is no package.json', async () => {
    async function check() {
      await getRootDependencies({
        cwd: path.join(process.cwd(), `test/fixtures/require-typescript/basic`),
      });
    }

    await expect(check()).rejects.toThrow();
  });
});
