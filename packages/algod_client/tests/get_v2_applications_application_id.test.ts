import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config, TEST_APP_ID } from './config'
import { Application } from './schemas'

describe('GET v2_applications_APPLICATION-ID', () => {
  // Polytest Suite: GET v2_applications_APPLICATION-ID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getApplicationById(TEST_APP_ID)

      Application.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
