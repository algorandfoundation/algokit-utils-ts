import { defineConfig } from 'vitest/config'

export default defineConfig({
  appType: 'custom',
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules'],
    // Disabled: localnet tests don't need mock server setup
    // globalSetup: ['./tests/globalSetup.ts'],
    testTimeout: 30_000,
    hookTimeout: 60_000,
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['tests/*.*'],
      reporter: ['text', 'html'],
    },
    pool: 'forks',
    maxWorkers: 1,
    isolate: false,
    sequence: {
      groupOrder: 3,
    },
  },
})
