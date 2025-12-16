import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config, TEST_APP_ID } from './config'
import { ApplicationLogsResponse } from './schemas'

describe('GET v2_applications_APPLICATION-ID_logs', () => {
  // Polytest Suite: GET v2_applications_APPLICATION-ID_logs

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupApplicationLogsById(TEST_APP_ID)

      ApplicationLogsResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})