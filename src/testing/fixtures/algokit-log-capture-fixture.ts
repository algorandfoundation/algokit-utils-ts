import { Config } from '../../'
import { TestLogger } from '../test-logger'
import { AlgoKitLogCaptureFixture } from '../types'

/**
 * Creates a test fixture for capturing AlgoKit logs.
 *
 * @example
 * ```typescript
 * const logs = algoKitLogCaptureFixture()
 *
 * beforeEach(logs.beforeEach)
 * afterEach(logs.afterEach)
 *
 * test('My test', () => {
 *     const capturedLogs = logs.testLogger.capturedLogs
 * })
 * ```
 *
 * @returns The fixture
 */
export const algoKitLogCaptureFixture: () => AlgoKitLogCaptureFixture = () => {
  const originalLogger = Config.logger

  let hybridLogger: TestLogger

  return {
    get testLogger() {
      return hybridLogger
    },
    beforeEach: () => {
      hybridLogger = new TestLogger(originalLogger)
      Config.configure({
        logger: hybridLogger,
      })
    },
    afterEach: () => {
      Config.configure({
        logger: originalLogger,
      })
    },
  }
}
