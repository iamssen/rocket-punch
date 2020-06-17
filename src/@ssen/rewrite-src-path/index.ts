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

export function rewriteSrcPath(params: Params) {
  const importPath: string = params.importPath;
  const filePath: string = params.filePath.replace(/\\/g, '/');
  const rootDir: string = params.rootDir.replace(/\\/g, '/');

  if (/^\.\./.test(importPath)) {
    const dir: string = path.dirname(filePath);
    const targetFilePath: string = path.join(dir, importPath);
    const packageName: string = toPackageName(path.relative(rootDir, filePath));
    const targetPackageName: string = toPackageName(path.relative(rootDir, targetFilePath));

    return packageName !== targetPackageName ? targetPackageName : importPath;
  }

  return importPath;
}
