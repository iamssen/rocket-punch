import fs from 'fs-extra';

export function fsCopySourceFilter(src: string): boolean {
  if (
    (!/__(\w*)__/.test(src) && !/__tests__/.test(src) && !/\.(ts|tsx)$/.test(src) && !/package.js$/.test(src)) ||
    /\.d\.ts$/.test(src)
  ) {
    //if (!process.env.JEST_WORKER_ID) {
    //  if (fs.statSync(src).isFile()) console.log(src);
    //}
    return true;
  }
  return false;
}
