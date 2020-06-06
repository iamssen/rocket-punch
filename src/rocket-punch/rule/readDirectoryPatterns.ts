export const readDirectoryPatterns: [string[], string[], string[]] = [
  // extensions
  ['.ts', '.tsx', '.js', '.jsx'],
  // excludes
  [
    // exclude tests
    '**/*.spec.js',
    '**/*.spec.jsx',
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/*.test.js',
    '**/*.test.jsx',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/__tests__',
    '**/__test__',
    '**/__*',

    // exclude public
    '**/public',
  ],
  // includes
  ['**/*'],
];
