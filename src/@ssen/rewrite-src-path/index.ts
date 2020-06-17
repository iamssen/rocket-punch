import path from 'path';

interface Params {
  /** import '..a' */
  importPath: string;

  /** absolute file path */
  filePath: string;

  /** absolute src directory path */
  rootDir: string;
}

function toPackageName(fullPath: string): string {
  const p: string = fullPath.replace(/\\/g, '/');
  if (/^@/.test(p)) {
    return p.split('/').splice(0, 2).join('/');
  } else {
    return p.split('/')[0];
  }
}

export function rewriteSrcPath({ importPath, filePath, rootDir }: Params) {
  if (/^\.\./.test(importPath)) {
    const dir: string = path.dirname(filePath);
    const targetFilePath: string = path.join(dir, importPath);
    const packageName: string = toPackageName(path.relative(rootDir, filePath));
    const targetPackageName: string = toPackageName(path.relative(rootDir, targetFilePath));

    return packageName !== targetPackageName ? targetPackageName : importPath;
  }

  return importPath;
}
