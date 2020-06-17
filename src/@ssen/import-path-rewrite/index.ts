import { rewriteSrcPath } from '@ssen/rewrite-src-path';
import {
  createLiteral,
  createNodeArray,
  createStringLiteral,
  Expression,
  getMutableClone,
  isCallExpression,
  isIdentifier,
  isImportDeclaration,
  isPropertyAccessExpression,
  isStringLiteralLike,
  Node,
  SourceFile,
  StringLiteralLike,
  SyntaxKind,
  TransformationContext,
  TransformerFactory,
  visitEachChild,
  visitNode,
  Visitor,
} from 'typescript';

interface Configuration {
  src: string;
  fileName?: string;
}

function createVisitor({ src, ctx, fileName }: Configuration & { ctx: TransformationContext }): Visitor {
  const visitor: Visitor = (node: Node): Node => {
    // import from '?'
    if (isImportDeclaration(node) && isStringLiteralLike(node.moduleSpecifier) && node.moduleSpecifier.text) {
      const importPath: string = node.moduleSpecifier.text;
      const rewrittenImportPath: string = rewriteSrcPath({
        importPath,
        filePath: fileName || node.getSourceFile().fileName,
        rootDir: src,
      });

      if (importPath !== rewrittenImportPath) {
        const newNode = getMutableClone(node);
        newNode.moduleSpecifier = createLiteral(rewrittenImportPath);
        return newNode;
      }
    }
    // import('?')
    else if (
      isCallExpression(node) &&
      node.expression.kind === SyntaxKind.ImportKeyword &&
      isStringLiteralLike(node.arguments[0])
    ) {
      const importPath: string = (node.arguments[0] as StringLiteralLike).text;
      const rewrittenImportPath: string = rewriteSrcPath({
        importPath,
        filePath: fileName || node.getSourceFile().fileName,
        rootDir: src,
      });

      if (importPath !== rewrittenImportPath) {
        const newNode = getMutableClone(node);
        const newArguments: Expression[] = [...node.arguments];
        newArguments[0] = createStringLiteral(rewrittenImportPath);
        newNode.arguments = createNodeArray(newArguments);
        return newNode;
      }
    }
    // require.resolve('?')
    else if (
      isCallExpression(node) &&
      isPropertyAccessExpression(node.expression) &&
      isIdentifier(node.expression.expression) &&
      node.expression.expression.escapedText === 'require' &&
      node.expression.name.escapedText === 'resolve' &&
      isStringLiteralLike(node.arguments[0])
    ) {
      const importPath: string = (node.arguments[0] as StringLiteralLike).text;
      const rewrittenImportPath: string = rewriteSrcPath({
        importPath,
        filePath: fileName || node.getSourceFile().fileName,
        rootDir: src,
      });

      if (importPath !== rewrittenImportPath) {
        const newNode = getMutableClone(node);
        const newArguments: Expression[] = [...node.arguments];
        newArguments[0] = createStringLiteral(rewrittenImportPath);
        newNode.arguments = createNodeArray(newArguments);
        return newNode;
      }
    }
    // require('?')
    else if (
      isCallExpression(node) &&
      isIdentifier(node.expression) &&
      node.expression.escapedText === 'require' &&
      isStringLiteralLike(node.arguments[0])
    ) {
      const importPath: string = (node.arguments[0] as StringLiteralLike).text;
      const rewrittenImportPath: string = rewriteSrcPath({
        importPath,
        filePath: fileName || node.getSourceFile().fileName,
        rootDir: src,
      });

      if (importPath !== rewrittenImportPath) {
        const newNode = getMutableClone(node);
        const newArguments: Expression[] = [...node.arguments];
        newArguments[0] = createStringLiteral(rewrittenImportPath);
        newNode.arguments = createNodeArray(newArguments);
        return newNode;
      }
    }

    return visitEachChild(node, visitor, ctx);
  };

  return visitor;
}

export const importPathRewrite = (config: Configuration): TransformerFactory<SourceFile> => (
  ctx: TransformationContext,
) => (node: SourceFile) => {
  return visitNode(node, createVisitor({ ...config, ctx }));
};
