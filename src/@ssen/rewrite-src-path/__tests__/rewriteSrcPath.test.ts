import { rewriteSrcPath } from '@ssen/rewrite-src-path';

describe('rewritePath()', () => {
  test('test', () => {
    expect(
      rewriteSrcPath({
        importPath: './a',
        filePath: '/foo/bar/src/b/index.ts',
        rootDir: '/foo/bar/src',
      }),
    ).toBe('./a');

    expect(
      rewriteSrcPath({
        importPath: '../a',
        filePath: '/foo/bar/src/b/index.ts',
        rootDir: '/foo/bar/src',
      }),
    ).toBe('a');

    expect(
      rewriteSrcPath({
        importPath: '../a',
        filePath: '/foo/bar/src/@group/b/index.ts',
        rootDir: '/foo/bar/src',
      }),
    ).toBe('@group/a');

    expect(
      rewriteSrcPath({
        importPath: '../../a',
        filePath: '/foo/bar/src/@group/b/index.ts',
        rootDir: '/foo/bar/src',
      }),
    ).toBe('a');
  });
});
