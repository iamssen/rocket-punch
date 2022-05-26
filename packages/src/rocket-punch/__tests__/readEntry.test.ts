import { copyTmpDirectory } from '@ssen/tmp-directory';
import path from 'path';
import process from 'process';
import { readEntry } from 'rocket-punch/entry/readEntry';
import { PackageConfig } from 'rocket-punch/types';
import { describe, test, expect } from 'vitest';

describe('readEntry()', () => {
  test('should ignore $schema property', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), 'test/fixtures/rocket-punch/schema'),
    );

    // Act
    const packages: Record<string, string | PackageConfig> = readEntry({ cwd });

    // Assert
    expect(packages).toEqual({
      test: {
        version: '1.0.0',
      },
    });
  });
});
