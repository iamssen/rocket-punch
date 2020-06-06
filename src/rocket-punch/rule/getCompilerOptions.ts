import ts from 'typescript';

// TODO use user tsconfig.json
export function getCompilerOptions(): ts.CompilerOptions {
  return {
    downlevelIteration: true,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,

    alwaysStrict: true,
    strictNullChecks: true,
    strictBindCallApply: true,
    strictFunctionTypes: true,
    strictPropertyInitialization: true,
    resolveJsonModule: true,

    allowJs: true,
    jsx: ts.JsxEmit.React,

    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.Latest,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    skipLibCheck: true,
    sourceMap: true,
    declaration: true,
  };
}
