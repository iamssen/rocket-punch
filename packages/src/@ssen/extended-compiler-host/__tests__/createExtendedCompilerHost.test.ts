import { copyTmpDirectory, createTmpDirectory } from '@ssen/tmp-directory';
import fs from 'fs-extra';
import path from 'path';
import process from 'process';
import ts from 'typescript';
import { describe, expect, test } from 'vitest';
import { createExtendedCompilerHost } from '../';

describe('createExtendedCompilerHost', () => {
  test('should get the transformed data', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), 'test/fixtures/rocket-punch/bundle'),
    );
    const dist: string = await createTmpDirectory();

    const compilerOptions: ts.CompilerOptions = {
      downlevelIteration: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,

      alwaysStrict: true,
      strictNullChecks: true,
      strictBindCallApply: true,
      strictFunctionTypes: true,
      strictPropertyInitialization: true,
      resolveJsonModule: true,

      allowJs: true,
      jsx: ts.JsxEmit.React,

      target: ts.ScriptTarget.ES2016,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      skipLibCheck: true,
      sourceMap: false,
      declaration: false,

      baseUrl: path.join(cwd, 'src'),
      outDir: dist,
    };

    const host: ts.CompilerHost = createExtendedCompilerHost(compilerOptions);

    const files: string[] = host.readDirectory!(
      path.join(cwd, 'src'),
      ['.ts', '.tsx', '.js', '.jsx'],
      [],
      ['**/*'],
    );

    const program: ts.Program = ts.createProgram(files, compilerOptions, host);

    // Act
    program.emit();

    // Assert
    expect(fs.existsSync(path.join(dist, 'a/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'a/icon.svg.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'b/test.txt.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/index.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/image.jpg.js'))).toBeTruthy();
    expect(fs.existsSync(path.join(dist, 'c/data.yaml.js'))).toBeTruthy();
  });
});
