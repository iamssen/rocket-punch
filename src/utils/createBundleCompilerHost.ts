import svgr from '@svgr/core';
import fs from 'fs-extra';
import { safeLoad } from 'js-yaml';
import path from 'path';
import {
  CompilerHost,
  CompilerOptions,
  createCompilerHost,
  createSourceFile,
  ScriptKind,
  ScriptTarget,
  SourceFile,
} from 'typescript';

interface BundleConfig {
  getSourceText: (fileName: string) => string;
}

const plainTextBundleConfig: BundleConfig = {
  getSourceText: (fileName: string) => {
    const file: string = fileName.substr(0, fileName.length - 4);
    const content: string = fs.readFileSync(file, 'utf8');
    return `export default '${content}'`;
  },
};

const imageBundleConfig: BundleConfig = {
  getSourceText: (fileName: string) => {
    const file: string = fileName.substr(0, fileName.length - 4);
    const ext: string = path.extname(file);
    const source: string = fs.readFileSync(file, 'base64').replace(/[\r\n]+/gm, '');
    return `export default 'data:image/${ext};base64,${source}'`;
  },
};

const yamlBundleConfig: BundleConfig = {
  getSourceText: (fileName: string) => {
    const file: string = fileName.substr(0, fileName.length - 4);
    const content: string = fs.readFileSync(file, 'utf8');
    return `export default ${JSON.stringify(safeLoad(content))}`;
  },
};

const bundleConfigs: Record<string, BundleConfig> = {
  txt: plainTextBundleConfig,
  md: plainTextBundleConfig,
  yml: yamlBundleConfig,
  yaml: yamlBundleConfig,
  jpg: imageBundleConfig,
  jpeg: imageBundleConfig,
  gif: imageBundleConfig,
  png: imageBundleConfig,
  webp: imageBundleConfig,
  svg: {
    getSourceText: (fileName: string) => {
      const file: string = fileName.substr(0, fileName.length - 4);
      const content: string = fs.readFileSync(file, 'utf8');
      return svgr.sync(content, { typescript: true }, { componentName: 'MyComponent' });
    },
  },
};

const exts: string[] = Object.keys(bundleConfigs);

function findConfig(fileName: string): BundleConfig | undefined {
  for (const ext of exts) {
    if (new RegExp(`.${ext}.tsx$`).test(fileName)) {
      return bundleConfigs[ext];
    }
  }

  return undefined;
}

export function createBundleCompilerHost(options: CompilerOptions, setParentNodes?: boolean): CompilerHost {
  const compilerHost: CompilerHost = createCompilerHost(options, setParentNodes);

  function fileExists(fileName: string): boolean {
    const config: BundleConfig | undefined = findConfig(fileName);
    return !!config || compilerHost.fileExists(fileName);
  }

  function getSourceFile(
    fileName: string,
    languageVersion: ScriptTarget,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean,
  ): SourceFile | undefined {
    const config: BundleConfig | undefined = findConfig(fileName);

    if (config) {
      const sourceText: string = config.getSourceText(fileName);
      return createSourceFile(
        fileName,
        sourceText,
        options.target || ScriptTarget.Latest,
        setParentNodes,
        ScriptKind.TSX,
      );
    }

    return compilerHost.getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
  }

  return {
    ...compilerHost,
    fileExists,
    getSourceFile,
  };
}
