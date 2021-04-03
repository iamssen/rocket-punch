import {
  imageTransformer,
  plainTextTransformer,
  svgTransformer,
  Transformer,
  yamlTransformer,
} from '@ssen/transform';
import ts from 'typescript';

const transformerMap: Record<string, Transformer> = {
  html: plainTextTransformer,
  ejs: plainTextTransformer,
  txt: plainTextTransformer,
  md: plainTextTransformer,
  yml: yamlTransformer,
  yaml: yamlTransformer,
  jpg: imageTransformer,
  jpeg: imageTransformer,
  gif: imageTransformer,
  png: imageTransformer,
  webp: imageTransformer,
  svg: svgTransformer,
};

export const targetExtensions: string[] = Object.keys(transformerMap);

function findConfig(fileName: string): Transformer | undefined {
  for (const ext of targetExtensions) {
    if (new RegExp(`\\.${ext}\\.tsx$`).test(fileName)) {
      return transformerMap[ext];
    }
  }

  return undefined;
}

export function createExtendedCompilerHost(
  options: ts.CompilerOptions,
  setParentNodes?: boolean,
  compilerHost: ts.CompilerHost = ts.createCompilerHost(
    options,
    setParentNodes,
  ),
): ts.CompilerHost {
  // When user import like `import svg from './some.svg'
  // CompilerHost searches by fileExists()
  // /absoulte-path/some.svg.ts -> /absoulte-path/some.svg.tsx -> /absoulte-path/some.svg.d.ts
  function fileExists(fileName: string): boolean {
    const transformer: Transformer | undefined = findConfig(fileName);
    return !!transformer || compilerHost.fileExists(fileName);
  }

  // When fileExists() returns true
  // CompilerHost request the source file by getSourceFile()
  function getSourceFile(
    fileName: string,
    languageVersion: ts.ScriptTarget,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean,
  ): ts.SourceFile | undefined {
    const transformer: Transformer | undefined = findConfig(fileName);

    // if transformConfig exists this CompilerHost returns the transformed data
    if (transformer) {
      const option: Record<string, string> | undefined = /\.svg\.tsx$/.test(
        fileName,
      )
        ? {
            variant:
              process.env.TS_SVG_EXPORT === 'default'
                ? 'default'
                : 'create-react-app',
          }
        : undefined;
      const sourceText: string = transformer.getSourceText(option)(
        // remove .tsx
        fileName.substr(0, fileName.length - 4),
      );
      return ts.createSourceFile(
        fileName,
        sourceText,
        options.target || ts.ScriptTarget.Latest,
        setParentNodes,
        ts.ScriptKind.TSX,
      );
    }

    // if not, pass to the original CompilerHost
    return compilerHost.getSourceFile(
      fileName,
      languageVersion,
      onError,
      shouldCreateNewSourceFile,
    );
  }

  return {
    ...compilerHost,
    fileExists,
    getSourceFile,
  };
}
