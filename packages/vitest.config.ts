import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: ['tsconfig.json'],
    }),
  ],
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/fixtures/**',
    ],
    testTimeout: 240000,
  },
  esbuild: {
    target: 'node14',
  },
});
