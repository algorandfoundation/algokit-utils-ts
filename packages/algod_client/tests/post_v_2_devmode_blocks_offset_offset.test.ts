import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { localnetConfig } from './config'

describe('POST v2_devmode_blocks_offset_OFFSET', () => {
  // Polytest Suite: POST v2_devmode_blocks_offset_OFFSET

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      // Set a timestamp offset of 60 seconds
      const result = await client.setBlockTimeStampOffset(60)

      // Assert response structure - setBlockTimeStampOffset returns void (no response body)
      expectTypeOf(result).toEqualTypeOf<void>()
      expect(result).toBeUndefined()
    })
  })
})
