import svgToJsx from '@svgr/plugin-jsx';
import fs from 'fs-extra';
import { safeLoad } from 'js-yaml';
import svgToMiniDataURI from 'mini-svg-data-uri';
import path from 'path';
import ts from 'typescript';

interface TransformConfig {
  getSourceText: (fileName: string) => string;
}

const plainTextTransformConfig: TransformConfig = {
  getSourceText: (fileName: string) => {
    const file: string = fileName.substr(0, fileName.length - 4);
    const content: string = fs.readFileSync(file, 'utf8');
    return `export default '${content}'`;
  },
};

const imageTransformConfig: TransformConfig = {
  getSourceText: (fileName: string) => {
    const file: string = fileName.substr(0, fileName.length - 4);
    const ext: string = path.extname(file);
    const source: string = fs
      .readFileSync(file, 'base64')
      .replace(/[\r\n]+/gm, '');
    return `export default 'data:image/${ext};base64,${source}'`;
  },
};

const yamlTransformConfig: TransformConfig = {
  getSourceText: (fileName: string) => {
    const file: string = fileName.substr(0, fileName.length - 4);
    const content: string = fs.readFileSync(file, 'utf8');
    return `export default ${JSON.stringify(safeLoad(content))}`;
  },
};

const transformConfigs: Record<string, TransformConfig> = {
  html: plainTextTransformConfig,
  ejs: plainTextTransformConfig,
  txt: plainTextTransformConfig,
  md: plainTextTransformConfig,
  yml: yamlTransformConfig,
  yaml: yamlTransformConfig,
  jpg: imageTransformConfig,
  jpeg: imageTransformConfig,
  gif: imageTransformConfig,
  png: imageTransformConfig,
  webp: imageTransformConfig,
  svg: {
    getSourceText: (fileName: string) => {
      const file: string = fileName.substr(0, fileName.length - 4);
      const svgCode: string = fs
        .readFileSync(file, 'utf8')
        .replace(/[\r\n]+/gm, '');
      const componentName: string = 'ReactComponent';
      const reactCode: string = svgToJsx(svgCode, {}, { componentName });

      if (process.env.TS_SVG_EXPORT === 'default') {
        return reactCode;
      }

      const lines: string[] = reactCode.split('\n');
      return [
        ...lines.slice(0, lines.length - 1),
        `export default \`${svgToMiniDataURI(svgCode)}\`;`,
        `export {${componentName}};`,
      ].join('\n');
    },
  },
};

export const targetExtensions: string[] = Object.keys(transformConfigs);

function findConfig(fileName: string): TransformConfig | undefined {
  for (const ext of targetExtensions) {
    if (new RegExp(`\\.${ext}\\.tsx$`).test(fileName)) {
      return transformConfigs[ext];
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
  function fileExists(fileName: string): boolean {
    const transformConfig: TransformConfig | undefined = findConfig(fileName);
    return !!transformConfig || compilerHost.fileExists(fileName);
  }

  function getSourceFile(
    fileName: string,
    languageVersion: ts.ScriptTarget,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean,
  ): ts.SourceFile | undefined {
    const transformConfig: TransformConfig | undefined = findConfig(fileName);

    if (transformConfig) {
      const sourceText: string = transformConfig.getSourceText(fileName);
      return ts.createSourceFile(
        fileName,
        sourceText,
        options.target || ts.ScriptTarget.Latest,
        setParentNodes,
        ts.ScriptKind.TSX,
      );
    }

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
