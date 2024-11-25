import { afterAll, beforeEach, vitest } from 'vitest'

export const envResetFixture = () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vitest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  return {
    originalEnv: OLD_ENV,
  }
}
