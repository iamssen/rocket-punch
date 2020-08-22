import { importPathRewrite } from '@ssen/import-path-rewrite';
import ts from 'typescript';

interface Configuration {
  /**
   * source root
   *
   * /project/root/src
   */
  src: string;

  /**
   * package source directory
   *
   * /project/root/src/<package>
   */
  rootDir: string;
}

export const createImportPathRewriteCompilerHost = ({ src, rootDir }: Configuration) => (
  options: ts.CompilerOptions,
  setParentNodes?: boolean,
  compilerHost: ts.CompilerHost = ts.createCompilerHost(options, setParentNodes),
): ts.CompilerHost => {
  // wrap getSourceFile
  function getSourceFile(
    fileName: string,
    languageVersion: ts.ScriptTarget,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean,
  ): ts.SourceFile | undefined {
    // get origin compiler host result
    const sourceFile: ts.SourceFile | undefined = compilerHost.getSourceFile(
      fileName,
      languageVersion,
      onError,
      shouldCreateNewSourceFile,
    );

    return sourceFile
      ? // if fileName starts with rootDir
        // for example, "/project/root/src/<package>/file.ts" starts with "/project/root/src/<package>"
        fileName.replace(/\\/g, '/').indexOf(rootDir.replace(/\\/g, '/')) > -1
        ? // transform import paths in import, import(), require() and require.resolve() files
          ts.transform(sourceFile, [importPathRewrite({ src, fileName })], options).transformed[0]
        : sourceFile
      : undefined;
  }

  // create wrapped compiler host
  return {
    ...compilerHost,
    getSourceFile,
  };
};
