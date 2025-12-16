import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config, TEST_APP_ID_WITH_BOXES } from './config'
import { BoxesResponse } from './schemas'

describe('GET v2_applications_APPLICATION-ID_boxes', () => {
  // Polytest Suite: GET v2_applications_APPLICATION-ID_boxes

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getApplicationBoxes(TEST_APP_ID_WITH_BOXES)

      BoxesResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
