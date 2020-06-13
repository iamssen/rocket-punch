import { targetExtensions } from '@ssen/extended-compiler-host';
import fs from 'fs-extra';
import { packageJsonFactoryFileNamePattern } from './fileNames';

const bundleExtensions: RegExp = new RegExp(`.(${targetExtensions.join('|')})$`);

// if the file bundled by like `import text from './some.txt'`
// it does not copy
function isBundled(dest: string): boolean {
  return bundleExtensions.test(dest) && fs.existsSync(dest + '.js');
}

// prettier-ignore
export function fsCopyFilter(src: string, dest: string): boolean {
  const s: string = src.replace(/\\/g, '/');
  
  const completelyIgnore: boolean =
    /__(\w*)__/.test(s);                           // __tests__ , __fixtures__
  
  const ignore: boolean =
    /\.(ts|tsx|mjs|js|jsx)$/.test(s) ||            // *.ts, *.tsx, *.js, *.jsx, *.mjs
    isBundled(dest) ||                             // *.txt, *.md, *.yml...
    packageJsonFactoryFileNamePattern.test(s);     // .package.json.(js|ts)
  
  const pass: boolean =
    !completelyIgnore &&
    (
      !ignore ||
      /\.d\.ts$/.test(s) ||                        // *.d.ts
      /\/bin\/[a-zA-Z0-9._-]+.js$/.test(s) ||      // bin/*.js
      /\/public\//.test(s)                         // public/*
    );
  
  //if (pass && !process.env.JEST_WORKER_ID) {
  //if (fs.statSync(s).isFile()) console.log('COPY:', s);
  //}
  
  return pass;
}
