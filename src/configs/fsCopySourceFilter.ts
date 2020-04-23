import { packageJsonFactoryFileNamePattern } from './fileNames';

// prettier-ignore
export function fsCopySourceFilter(src: string): boolean {
  return (
    (
      // IGNORE PATTERNS
      !/__(\w*)__/.test(src) &&                    // IGNORE : __tests__ , __fixtures__
      !/\.(ts|tsx)$/.test(src) &&                  // IGNORE : *.ts, *.tsx
      !packageJsonFactoryFileNamePattern.test(src) // IGNORE : .package.json.js
    ) ||
      // OK PATTERNS
      /\.d\.ts$/.test(src)                         // OK : *.d.ts
  );
}
