import fs from 'fs';
import path from 'path';

interface Params {
  cwd?: string;
  tsconfig?: object;
}

const defaultTsconfig: object = {
  compilerOptions: {
    downlevelIteration: true,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,

    alwaysStrict: true,
    strictNullChecks: true,
    strictBindCallApply: true,
    strictFunctionTypes: true,
    strictPropertyInitialization: true,
    resolveJsonModule: true,

    module: 'commonjs',
    target: 'esnext',
    moduleResolution: 'node',
    skipLibCheck: true,
    sourceMap: true,
    declaration: true,

    baseUrl: 'src',
    paths: {
      '*': ['*'],
    },
  },
};

export function init({ cwd = process.cwd(), tsconfig = defaultTsconfig }: Params) {
  // tsconfig.json
  fs.writeFileSync(path.join(cwd, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
}
