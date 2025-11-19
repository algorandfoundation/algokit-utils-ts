import { describe, expect, test } from 'vitest'
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

      // Should return void (undefined)
      expect(result).toMatchSnapshot()
      expect(result).toBeUndefined()
    })

    test('Set offset and verify with GET', async () => {
      const client = new AlgodClient(localnetConfig)

      // Set offset to 100 seconds
      await client.setBlockTimeStampOffset(100)

      // Verify it was set by reading it back
      const currentOffset = await client.getBlockTimeStampOffset()
      expect(currentOffset.offset).toBe(100)
    })

    test('Unset offset with zero', async () => {
      const client = new AlgodClient(localnetConfig)

      // Offset of 0 unsets the value and uses real clock
      const result = await client.setBlockTimeStampOffset(0)

      expect(result).toBeUndefined()

      // Verify it was unset
      const currentOffset = await client.getBlockTimeStampOffset()
      expect(currentOffset.offset).toBe(0)
    })
  })
})
