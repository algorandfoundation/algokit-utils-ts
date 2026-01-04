import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { localnetConfig } from './config'

describe('POST v2_devmode_blocks_offset_OFFSET', () => {
  // Polytest Suite: POST v2_devmode_blocks_offset_OFFSET

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      // Set a timestamp offset of 60 seconds
      const result = await client.setBlockTimeStampOffset(60)

      // setBlockTimeStampOffset returns void (no response body)
      expect(result).toBeUndefined()
    })
  })
})
