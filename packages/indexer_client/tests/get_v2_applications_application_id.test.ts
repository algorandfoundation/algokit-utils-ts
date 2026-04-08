import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config, TEST_APP_ID } from './config'
import { ApplicationResponse } from './schemas'

describe('GET v2_applications_APPLICATION-ID', () => {
  // Polytest Suite: GET v2_applications_APPLICATION-ID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupApplicationById(TEST_APP_ID)

      ApplicationResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})