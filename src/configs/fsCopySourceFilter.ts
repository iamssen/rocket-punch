import { packageJsonFactoryFileNamePattern } from './packageJsonFactoryFileName';

export function fsCopySourceFilter(src: string): boolean {
  // IGNORE : __tests__ , __fixtures__
  // IGNORE : *.ts, *.tsx
  //     OK : *.d.ts
  // IGNORE : package.js
  if (
    (!/__(\w*)__/.test(src) && !/\.(ts|tsx)$/.test(src) && !packageJsonFactoryFileNamePattern.test(src)) ||
    /\.d\.ts$/.test(src)
  ) {
    // if (!process.env.JEST_WORKER_ID && fs.statSync(src).isFile()) {
    //   console.log(src);
    // }
    return true;
  }
  return false;
}
