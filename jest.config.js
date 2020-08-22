module.exports = {
  roots: ['<rootDir>/source/src/'],
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testTimeout: 50000,
  testMatch: ['**/__test?(s)__/**/*.ts?(x)', '**/?(*.)(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverageFrom: [
    'source/src/**/*.ts?(x)',
    '!**/*.d.ts?(x)',
    '!**/__*__/**',
    '!**/bin/**',
    '!source/src/rocket-punch/message-handlers/**',
    '!source/src/rocket-punch/bin.ts',
  ],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  moduleDirectories: ['<rootDir>/source/src', 'node_modules'],
  //modulePaths: ['<rootDir>/source/src/'],
};
