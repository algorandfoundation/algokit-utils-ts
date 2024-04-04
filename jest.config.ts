import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  testTimeout: 20000,
  bail: 1,
  setupFiles: ['<rootDir>/tests/setup.ts'],
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        diagnostics: {
          ignoreCodes: [1343],
        },
      },
    ],
  },
  coveragePathIgnorePatterns: ['tests'],
}
export default config
