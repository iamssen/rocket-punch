module.exports = {
  roots: ['<rootDir>/src/'],
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testTimeout: process.env.CI ? 100000 : 50000,
  testMatch: ['**/__test?(s)__/**/*.ts?(x)', '**/?(*.)(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts?(x)',
    '!**/*.d.ts?(x)',
    '!**/__*__/**',
    '!**/bin/**',
    '!src/rocket-punch/message-handlers/**',
    '!src/rocket-punch/bin.ts',
    '!src/@ssen/jest-transform/mockup/**',
    '!src/@ssen/jest-transform/setup/**',
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  //moduleDirectories: ['<rootDir>/src', '<rootDir>/node_modules', '<rootDir>/../node_modules'],
  modulePaths: ['<rootDir>/src/'],
};
