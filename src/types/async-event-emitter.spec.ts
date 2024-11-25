/* eslint-disable no-console */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { Config } from '../config'
import { algoKitLogCaptureFixture } from '../testing/fixtures/algokit-log-capture-fixture'

describe('async-event-emitter', () => {
  const logging = algoKitLogCaptureFixture()
  beforeEach(logging.beforeEach)
  afterEach(logging.afterEach)

  const mockRegisterNodeDebugHandlers = () => {
    Config.events.on('event_a', (data: unknown) => {
      logging.testLogger.info('event_a', data)
    })
  }

  it('users code would looks like this', async () => {
    Config.configure({
      debug: true,
    })
    mockRegisterNodeDebugHandlers() // imitates invocation of algokit-utils-ts-debug

    Config.events.emitAsync('event_a', {
      hello: 'world',
    })

    // await for the event to be processed by checking if capturedLogs is empty
    while (logging.testLogger.capturedLogs.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    expect(logging.testLogger.capturedLogs).toMatchSnapshot()
  })
})
