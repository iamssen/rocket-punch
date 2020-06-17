import { rewriteSrcPath } from '@ssen/rewrite-src-path';

describe('rewritePath()', () => {
  test('should rewrite paths', () => {
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

  test('should rewrite paths on windows', () => {
    expect(
      rewriteSrcPath({
        importPath: './a',
        filePath: 'c:\\foo\\bar\\src\\b\\index.ts',
        rootDir: 'c:\\foo\\bar\\src',
      }),
    ).toBe('./a');

    expect(
      rewriteSrcPath({
        importPath: '../a',
        filePath: 'c:\\foo\\bar\\src\\b\\index.ts',
        rootDir: 'c:\\foo\\bar\\src',
      }),
    ).toBe('a');

    expect(
      rewriteSrcPath({
        importPath: '../a',
        filePath: 'c:\\foo\\bar\\src\\@group\\b\\index.ts',
        rootDir: 'c:\\foo\\bar\\src',
      }),
    ).toBe('@group/a');

    expect(
      rewriteSrcPath({
        importPath: '../../a',
        filePath: 'c:\\foo\\bar\\src\\@group\\b\\index.ts',
        rootDir: 'c:\\foo\\bar\\src',
      }),
    ).toBe('a');
  });
});
