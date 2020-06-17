import { importPathRewrite } from '@ssen/import-path-rewrite';
import {
  CompilerHost,
  CompilerOptions,
  createCompilerHost,
  ScriptTarget,
  SourceFile,
  transform,
} from 'typescript';

interface Configuration {
  src: string;
  rootDir: string;
}

export const createImportPathRewriteCompilerHost = ({ src, rootDir }: Configuration) => (
  options: CompilerOptions,
  setParentNodes?: boolean,
  compilerHost: CompilerHost = createCompilerHost(options, setParentNodes),
): CompilerHost => {
  function getSourceFile(
    fileName: string,
    languageVersion: ScriptTarget,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean,
  ): SourceFile | undefined {
    const sourceFile: SourceFile | undefined = compilerHost.getSourceFile(
      fileName,
      languageVersion,
      onError,
      shouldCreateNewSourceFile,
    );

    return sourceFile
      ? fileName.indexOf(rootDir) > -1
        ? transform(sourceFile, [importPathRewrite({ src, fileName })], options).transformed[0]
        : sourceFile
      : undefined;
  }

  return {
    ...compilerHost,
    getSourceFile,
  };
};
