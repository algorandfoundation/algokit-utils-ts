import path from 'path'
import { defineConfig } from 'vitest/config'
export default defineConfig({
  appType: 'custom',
  resolve: {
    alias: {
      '@algorandfoundation/algokit-abi': path.resolve(__dirname, 'packages/abi/src'),
      '@algorandfoundation/algokit-common': path.resolve(__dirname, 'packages/common/src'),
      '@algorandfoundation/algokit-transact': path.resolve(__dirname, 'packages/transact/src'),
      '@algorandfoundation/algokit-algod-client': path.resolve(__dirname, 'packages/algod_client/src'),
      '@algorandfoundation/algokit-indexer-client': path.resolve(__dirname, 'packages/indexer_client/src'),
      '@algorandfoundation/algokit-kmd-client': path.resolve(__dirname, 'packages/kmd_client/src'),
      '@algorandfoundation/algokit-testing': path.resolve(__dirname, 'packages/testing/src'),
      '@algorandfoundation/algokit-algo25': path.resolve(__dirname, 'packages/algo25/src'),
    },
  },
  test: {
    projects: ['.', 'packages/*'],
    include: ['**/*.spec.ts', '**/*.test.ts'],
    exclude: ['node_modules', 'packages/**', '.polytest*/**/*', '**/polytest_resources/**'],
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
