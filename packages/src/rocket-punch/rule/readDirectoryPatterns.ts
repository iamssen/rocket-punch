export const readDirectoryPatterns: [string[], string[], string[]] = [
  // extensions
  ['.ts', '.tsx', '.js', '.jsx'],
  // excludes
  [
    // exclude tests
    '**/*.(spec|test).(js|jsx|ts|tsx)',
    '**/__*',

    // exclude public
    '**/public',
    '**/bin',
  ],
  // includes
  ['**/*'],
];
