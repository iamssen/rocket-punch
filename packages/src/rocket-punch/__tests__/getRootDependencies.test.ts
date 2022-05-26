import path from 'path';
import process from 'process';
import { getRootDependencies } from 'rocket-punch/package-json/getRootDependencies';
import type { PackageJson } from 'type-fest';
import { describe, test, expect } from 'vitest';

describe('getRootDependencies()', () => {
  test('should get root dependencies', async () => {
    // Act
    const deps: PackageJson.Dependency = await getRootDependencies({
      cwd: path.join(process.cwd(), `test/fixtures/rocket-punch/sample`),
    });

    // Assert
    expect(deps['react']).not.toBeUndefined();
    expect(deps['react-app-polyfill']).not.toBeUndefined();
    expect(deps['react-dom']).not.toBeUndefined();
    expect(deps['@types/react']).not.toBeUndefined();
    expect(deps['@types/react-dom']).not.toBeUndefined();
    expect(deps['@types/webpack-env']).not.toBeUndefined();
  });

  test('should throw error if there is no package.json', async () => {
    async function check() {
      // Act
      await getRootDependencies({
        cwd: path.join(process.cwd(), `test/fixtures/require-typescript/basic`),
      });
    }

    // Assert
    // there is no package.json
    await expect(check()).rejects.toThrow();
  });
});
