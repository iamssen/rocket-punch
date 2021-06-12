interface Params {
  importPath: string;
}

export function rewriteBundleImport({ importPath }: Params) {
  if (
    /\.(html|ejs|txt|md|yml|yaml|jpg|jpeg|gif|png|webp|svg)$/.test(importPath)
  ) {
    return importPath + '.js';
  }

  return importPath;
}
