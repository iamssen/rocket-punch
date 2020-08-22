import { rewriteSrcPath } from '@ssen/rewrite-src-path';
import ts from 'typescript';

interface Configuration {
  /**
   * source root
   *
   * /project/root/src
   */
  src: string;

  /**
   * file path
   *
   * /project/root/src/path/file.ts
   */
  fileName?: string;
}

function createVisitor({
  src,
  ctx,
  fileName,
}: Configuration & { ctx: ts.TransformationContext }): ts.Visitor {
  const visitor: ts.Visitor = (node: ts.Node): ts.Node => {
    // import from '?'
    if (
      ts.isImportDeclaration(node) &&
      ts.isStringLiteralLike(node.moduleSpecifier) &&
      node.moduleSpecifier.text
    ) {
      const importPath: string = node.moduleSpecifier.text;
      const rewrittenImportPath: string = rewriteSrcPath({
        importPath,
        filePath: fileName || node.getSourceFile().fileName,
        rootDir: src,
      });

      if (importPath !== rewrittenImportPath) {
        return ts.factory.updateImportDeclaration(
          node,
          undefined,
          undefined,
          undefined,
          ts.createLiteral(rewrittenImportPath),
        );
      }
    }
    // import('?')
    else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      ts.isStringLiteralLike(node.arguments[0])
    ) {
      const importPath: string = (node.arguments[0] as ts.StringLiteralLike).text;
      const rewrittenImportPath: string = rewriteSrcPath({
        importPath,
        filePath: fileName || node.getSourceFile().fileName,
        rootDir: src,
      });

      if (importPath !== rewrittenImportPath) {
        return ts.factory.updateCallExpression(node, node.expression, node.typeArguments, [
          ts.createStringLiteral(rewrittenImportPath),
          ...node.arguments.slice(1),
        ]);
      }
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
      const rewrittenImportPath: string = rewriteSrcPath({
        importPath,
        filePath: fileName || node.getSourceFile().fileName,
        rootDir: src,
      });

      if (importPath !== rewrittenImportPath) {
        return ts.factory.updateCallExpression(node, node.expression, node.typeArguments, [
          ts.createStringLiteral(rewrittenImportPath),
          ...node.arguments.slice(1),
        ]);
      }
    }
    // require('?')
    else if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.escapedText === 'require' &&
      ts.isStringLiteralLike(node.arguments[0])
    ) {
      const importPath: string = (node.arguments[0] as ts.StringLiteralLike).text;
      const rewrittenImportPath: string = rewriteSrcPath({
        importPath,
        filePath: fileName || node.getSourceFile().fileName,
        rootDir: src,
      });

      if (importPath !== rewrittenImportPath) {
        return ts.factory.updateCallExpression(node, node.expression, node.typeArguments, [
          ts.createStringLiteral(rewrittenImportPath),
          ...node.arguments.slice(1),
        ]);
      }
    }

    return ts.visitEachChild(node, visitor, ctx);
  };

  return visitor;
}

export const importPathRewrite = (config: Configuration): ts.TransformerFactory<ts.SourceFile> => (
  ctx: ts.TransformationContext,
) => (node: ts.SourceFile) => {
  return ts.visitNode(node, createVisitor({ ...config, ctx }));
};
