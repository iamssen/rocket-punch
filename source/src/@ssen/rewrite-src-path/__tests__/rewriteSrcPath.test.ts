import { rewriteSrcPath } from '@ssen/rewrite-src-path';
import path from 'path';

describe('rewritePath()', () => {
  test('should rewrite paths', () => {
    expect(
      rewriteSrcPath({
        importPath: './a',
        filePath: path.join(__dirname, 'src/b/index.ts'),
        rootDir: path.join(__dirname, 'src'),
      }),
    ).toBe('./a');

    expect(
      rewriteSrcPath({
        importPath: '../a',
        filePath: path.join(__dirname, 'src/b/index.ts'),
        rootDir: path.join(__dirname, 'src'),
      }),
    ).toBe('a');

    expect(
      rewriteSrcPath({
        importPath: '../a',
        filePath: path.join(__dirname, 'src/@group/b/index.ts'),
        rootDir: path.join(__dirname, 'src'),
      }),
    ).toBe('@group/a');

    expect(
      rewriteSrcPath({
        importPath: '../../a',
        filePath: path.join(__dirname, 'src/@group/b/index.ts'),
        rootDir: path.join(__dirname, 'src'),
      }),
    ).toBe('a');
  });
});
