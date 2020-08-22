import { builtinModules } from 'module';
import { PackageJson } from 'type-fest';
import ts from 'typescript';
import { PackageInfo } from './types';

const nodeAPIList: Set<string> = new Set<string>(builtinModules);

export const collectTypeScript: { extensions: string[]; excludes: string[]; includes: string[] } = {
  extensions: ['.ts', '.tsx'],
  excludes: [
    // exclude tests
    '**/*.(spec|test).(js|jsx|ts|tsx)',
    '**/__*',

    // exclude public
    '**/public',
    '**/bin',

    // exclude javascript
    '**/*.js',
    '**/*.jsx',
  ],
  includes: ['**/*'],
};

export const collectScripts: { extensions: string[]; excludes: string[]; includes: string[] } = {
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  excludes: [
    // exclude tests
    '**/*.(spec|test).(js|jsx|ts|tsx)',
    '**/__*',

    // exclude public
    '**/public',
    '**/bin',

    // exclude public
    '**/public',
  ],
  includes: ['**/*'],
};

interface CollectDependenciesParams {
  // source directory
  rootDir: string;
  // dependency references
  internalPackages?: Map<string, PackageInfo>;
  externalPackages: PackageJson.Dependency;
  // typescript configs
  extensions?: string[];
  excludes?: string[];
  includes?: string[];
  compilerOptions?: ts.CompilerOptions;
  // if you want to do not collect some dependencies like this `import {} from 'self-package-name'`
  // you can pass this like { selfNames: new Set(['self-package-name']) }
  selfNames?: Set<string>;
  fixImportPath?: (args: { importPath: string; filePath: string }) => string;
  // if you set this to 'pass'
  // when find the undefined package name
  // it does not throw a error
  checkUndefinedPackage?: 'error' | 'pass';
}

export async function collectDependencies({
  rootDir,
  internalPackages = new Map(),
  externalPackages,
  extensions = collectTypeScript.extensions,
  excludes = collectTypeScript.excludes,
  includes = collectTypeScript.includes,
  compilerOptions = {},
  selfNames = new Set(),
  fixImportPath,
  checkUndefinedPackage = 'error',
}: CollectDependenciesParams): Promise<PackageJson.Dependency> {
  compilerOptions = {
    allowJs: extensions.some((ext) => /^.js/.test(ext)),
    ...compilerOptions,
    rootDir,
  };

  const host: ts.CompilerHost = ts.createCompilerHost(compilerOptions);

  const files: string[] = host.readDirectory!(rootDir, extensions, excludes, includes);

  const program: ts.Program = ts.createProgram(files, compilerOptions, host);

  const importPaths: Set<string> = new Set<string>();

  for (const file of files) {
    const sourceFile: ts.SourceFile | undefined = program.getSourceFile(file);

    if (!sourceFile) continue;

    function search(node: ts.Node) {
      // import from '?'
      if (
        ts.isImportDeclaration(node) &&
        ts.isStringLiteralLike(node.moduleSpecifier) &&
        node.moduleSpecifier.text
      ) {
        const importPath: string = node.moduleSpecifier.text;
        importPaths.add(
          typeof fixImportPath === 'function'
            ? fixImportPath({
                importPath,
                filePath: file,
              })
            : importPath,
        );
      }
      // import('?')
      else if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword &&
        ts.isStringLiteralLike(node.arguments[0])
      ) {
        const importPath: string = (node.arguments[0] as ts.StringLiteralLike).text;
        importPaths.add(
          typeof fixImportPath === 'function'
            ? fixImportPath({
                importPath,
                filePath: file,
              })
            : importPath,
        );
      }
      // require.resolve('?')
      else if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        ts.isIdentifier(node.expression.expression) &&
        node.expression.expression.escapedText === 'require' &&
        node.expression.name.escapedText === 'resolve' &&
        ts.isStringLiteralLike(node.arguments[0])
      ) {
        const importPath: string = (node.arguments[0] as ts.StringLiteralLike).text;
        importPaths.add(
          typeof fixImportPath === 'function'
            ? fixImportPath({
                importPath,
                filePath: file,
              })
            : importPath,
        );
      }
      // require('?')
      else if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.escapedText === 'require' &&
        ts.isStringLiteralLike(node.arguments[0])
      ) {
        const importPath: string = (node.arguments[0] as ts.StringLiteralLike).text;
        importPaths.add(
          typeof fixImportPath === 'function'
            ? fixImportPath({
                importPath,
                filePath: file,
              })
            : importPath,
        );
      }

      ts.forEachChild(node, search);
    }

    search(sourceFile);
  }

  const imports: PackageJson.Dependency = {};

  for (const importPath of importPaths) {
    const packageName: string = /^@/.test(importPath)
      ? importPath.split('/').slice(0, 2).join('/')
      : importPath.split('/')[0];

    if (
      !imports[packageName] &&
      !selfNames.has(packageName) &&
      !/^\./.test(packageName) &&
      !nodeAPIList.has(packageName)
    ) {
      const internalPackage: PackageInfo | undefined = internalPackages.get(packageName);

      if (internalPackage) {
        imports[packageName] = `^${internalPackage.version}`;
      } else if (externalPackages[packageName]) {
        imports[packageName] = externalPackages[packageName];
      } else if (checkUndefinedPackage === 'error') {
        throw new Error(`Undefined package "${packageName}" from "${importPath}"`);
      }
    }
  }

  return imports;
}
