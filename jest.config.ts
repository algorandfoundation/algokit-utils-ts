import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['src/**/*.spec.ts', 'tests/**/*.spec.ts'],
  transform: {
    '<regex_match_files>': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
}
export default config
