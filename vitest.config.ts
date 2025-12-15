import { defineConfig } from 'vitest/config'
export default defineConfig({
  appType: 'custom',
  test: {
    include: ['**/*.spec.ts'],
    exclude: ['node_modules'],
    setupFiles: ['tests/setup.ts'],
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['tests/*.*'],
      reporter: ['text', 'html'],
    },
    typecheck: {
      tsconfig: 'tsconfig.test.json',
    },
    env: {
      ALGOD_TOKEN: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      ALGOD_SERVER: 'http://localhost',
      ALGOD_PORT: '4001',
      KMD_PORT: '4002',
      INDEXER_TOKEN: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      INDEXER_SERVER: 'http://localhost',
      INDEXER_PORT: '8980',
    },
  },
})
