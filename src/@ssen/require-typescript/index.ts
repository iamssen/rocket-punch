import fs from 'fs';
import Module from 'module';
import path from 'path';
import ts from 'typescript';

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const memo: Map<string, any> = new Map<string, any>();

export function requireTypescript<T>(file: string): T & ts.TranspileOutput {
  const fileNames: string[] = [
    file,
    file + '.js',
    file + '.ts',
    path.join(file, 'index.ts'),
    path.join(file, 'index.js'),
  ];

  const existsFile: string | undefined = fileNames.find(
    (fileName) => fs.existsSync(fileName) && fs.statSync(fileName).isFile(),
  );

  if (!existsFile) {
    throw new Error(`undefined typescript file ${file}`);
  }

  const fileDate: number = fs.statSync(existsFile).mtimeMs;
  const fileId: string = existsFile + fileDate;

  if (memo.has(fileId)) {
    return memo.get(fileId);
  }

  const source: string = fs.readFileSync(existsFile, { encoding: 'utf-8' });

  const result: ts.TranspileOutput = ts.transpileModule(source, {
    compilerOptions: {
      downlevelIteration: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      skipLibCheck: true,
    },
  });

  //@ts-ignore hidden api
  const paths: string[] = Module._nodeModulePaths(path.dirname(existsFile));
  const parent: Module | null = module.parent;

  const m: Module = new Module(existsFile, parent || undefined);
  m.filename = existsFile;
  m.paths = paths;

  //@ts-ignore hidden api
  m._compile(result.outputText, existsFile);

  const output: T & ts.TranspileOutput = {
    ...result,
    ...m.exports,
  };

  memo.set(fileId, output);

  return output;
}
