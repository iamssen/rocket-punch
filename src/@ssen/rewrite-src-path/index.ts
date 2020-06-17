import path from 'path';

interface Params {
  /**
   * import '..a'
   */
  importPath: string;

  /**
   * absolute file path
   */
  filePath: string;

  rootDir: string;
}

function toPackageName(fullPath: string): string {
  if (/^@/.test(fullPath)) {
    return fullPath.split('/').splice(0, 2).join('/');
  } else {
    return fullPath.split('/')[0];
  }
}

export function rewriteSrcPath({ importPath, filePath, rootDir }: Params) {
  if (/^\.\./.test(importPath)) {
    const targetFilePath: string = path.join(path.dirname(filePath), importPath);
    const packageName: string = toPackageName(path.relative(rootDir, filePath));
    const targetPackageName: string = toPackageName(path.relative(rootDir, targetFilePath));

    return packageName !== targetPackageName ? targetPackageName : importPath;
  }

  return importPath;
}
