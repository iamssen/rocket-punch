import { rewriteSrcPath } from '@ssen/rewrite-src-path';
import ts from 'typescript';

interface Configuration {
  src: string;
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
        const newNode = ts.getMutableClone(node);
        newNode.moduleSpecifier = ts.createLiteral(rewrittenImportPath);
        return newNode;
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
        const newNode = ts.getMutableClone(node);
        const newArguments: ts.Expression[] = [...node.arguments];
        newArguments[0] = ts.createStringLiteral(rewrittenImportPath);
        newNode.arguments = ts.createNodeArray(newArguments);
        return newNode;
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
        const newNode = ts.getMutableClone(node);
        const newArguments: ts.Expression[] = [...node.arguments];
        newArguments[0] = ts.createStringLiteral(rewrittenImportPath);
        newNode.arguments = ts.createNodeArray(newArguments);
        return newNode;
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
        const newNode = ts.getMutableClone(node);
        const newArguments: ts.Expression[] = [...node.arguments];
        newArguments[0] = ts.createStringLiteral(rewrittenImportPath);
        newNode.arguments = ts.createNodeArray(newArguments);
        return newNode;
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
