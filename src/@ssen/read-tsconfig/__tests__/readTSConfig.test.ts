import { parseTSConfig, readTSConfig } from '@ssen/read-tsconfig';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import path from 'path';
import ts from 'typescript';

describe('readTSConfig()', () => {
  test('should read tsconfig without errors', async () => {
    const cwd: string = await copyTmpDirectory(process.cwd(), 'test/fixtures/rocket-punch/basic');
    const { options, errors } = readTSConfig(cwd);

    expect(options.downlevelIteration).toBeTruthy();
    expect(options.allowSyntheticDefaultImports).toBeTruthy();
    expect(options.esModuleInterop).toBeTruthy();
    expect(options.alwaysStrict).toBeTruthy();
    expect(options.jsx).toBe(ts.JsxEmit.React);
    expect(options.strictNullChecks).toBeTruthy();
    expect(options.strictBindCallApply).toBeTruthy();
    expect(options.strictFunctionTypes).toBeTruthy();
    expect(options.strictPropertyInitialization).toBeTruthy();
    expect(options.resolveJsonModule).toBeTruthy();
    expect(options.module).toBe(ts.ModuleKind.CommonJS);
    expect(options.target).toBe(ts.ScriptTarget.ES2018);
    expect(options.moduleResolution).toBe(ts.ModuleResolutionKind.NodeJs);
    expect(options.skipLibCheck).toBeTruthy();
    expect(options.sourceMap).toBeTruthy();
    expect(options.declaration).toBeTruthy();
    expect(options.baseUrl).toBe(path.join(cwd, 'src').replace(/\\/g, '/'));
    expect(JSON.stringify(options.paths)).toBe(JSON.stringify({ '*': ['*'] }));

    expect(options.allowJs).toBeUndefined();
    expect(options.rootDirs).toBeUndefined();

    expect(errors.length).toBe(0);
  });

  test('should parse object', async () => {
    const cwd: string = await copyTmpDirectory(process.cwd(), 'test/fixtures/rocket-punch/basic');
    const { options, errors } = parseTSConfig(cwd, {
      compilerOptions: {
        downlevelIteration: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        alwaysStrict: true,
        jsx: 'react',
        strictNullChecks: true,
        strictBindCallApply: true,
        strictFunctionTypes: true,
        strictPropertyInitialization: true,
        resolveJsonModule: true,
        module: 'commonjs',
        target: 'ES2018',
        moduleResolution: 'node',
        skipLibCheck: true,
        sourceMap: true,
        declaration: true,
        baseUrl: 'src',
        allowJs: undefined,
        paths: {
          '*': ['*'],
        },
      },
    });

    expect(options.downlevelIteration).toBeTruthy();
    expect(options.allowSyntheticDefaultImports).toBeTruthy();
    expect(options.esModuleInterop).toBeTruthy();
    expect(options.alwaysStrict).toBeTruthy();
    expect(options.jsx).toBe(ts.JsxEmit.React);
    expect(options.strictNullChecks).toBeTruthy();
    expect(options.strictBindCallApply).toBeTruthy();
    expect(options.strictFunctionTypes).toBeTruthy();
    expect(options.strictPropertyInitialization).toBeTruthy();
    expect(options.resolveJsonModule).toBeTruthy();
    expect(options.module).toBe(ts.ModuleKind.CommonJS);
    expect(options.target).toBe(ts.ScriptTarget.ES2018);
    expect(options.moduleResolution).toBe(ts.ModuleResolutionKind.NodeJs);
    expect(options.skipLibCheck).toBeTruthy();
    expect(options.sourceMap).toBeTruthy();
    expect(options.declaration).toBeTruthy();
    expect(options.baseUrl).toBe(path.join(cwd, 'src').replace(/\\/g, '/'));
    expect(JSON.stringify(options.paths)).toBe(JSON.stringify({ '*': ['*'] }));

    expect(options.allowJs).toBeUndefined();
    expect(options.rootDirs).toBeUndefined();

    expect(errors.length).toBe(0);
  });
});
