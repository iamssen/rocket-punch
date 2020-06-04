export const readDirectoryPatterns: [string[], string[], string[]] = [
  ['.ts', '.tsx', '.js', '.jsx'],
  [
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/*.spec.js',
    '**/*.spec.jsx',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.test.js',
    '**/*.test.jsx',
    '**/__*__',
    '**/__tests__',
    '**/__test__',
  ],
  ['**/*'],
];
