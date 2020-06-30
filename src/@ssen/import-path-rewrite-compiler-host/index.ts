import { importPathRewrite } from '@ssen/import-path-rewrite';
import ts from 'typescript';

interface Configuration {
  src: string;
  rootDir: string;
}

export const createImportPathRewriteCompilerHost = ({ src, rootDir }: Configuration) => (
  options: ts.CompilerOptions,
  setParentNodes?: boolean,
  compilerHost: ts.CompilerHost = ts.createCompilerHost(options, setParentNodes),
): ts.CompilerHost => {
  function getSourceFile(
    fileName: string,
    languageVersion: ts.ScriptTarget,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean,
  ): ts.SourceFile | undefined {
    const sourceFile: ts.SourceFile | undefined = compilerHost.getSourceFile(
      fileName,
      languageVersion,
      onError,
      shouldCreateNewSourceFile,
    );

    return sourceFile
      ? fileName.replace(/\\/g, '/').indexOf(rootDir.replace(/\\/g, '/')) > -1
        ? ts.transform(sourceFile, [importPathRewrite({ src, fileName })], options).transformed[0]
        : sourceFile
      : undefined;
  }

  return {
    ...compilerHost,
    getSourceFile,
  };
};
