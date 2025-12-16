import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { localnetConfig } from './config'
import { GetBlockTimeStampOffsetResponse } from './schemas'

describe('GET v2_devmode_blocks_offset', () => {
  // Polytest Suite: GET v2_devmode_blocks_offset

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      const result = await client.getBlockTimeStampOffset()

      GetBlockTimeStampOffsetResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
