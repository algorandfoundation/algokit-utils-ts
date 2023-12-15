import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  testTimeout: 10000,
  bail: 1,
  setupFiles: ['<rootDir>/tests/setup.ts'],
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '<regex_match_files>': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  coveragePathIgnorePatterns: ['tests'],
}
export default config
