import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { localnetConfig } from './config'

describe('GET v2_devmode_blocks_offset', () => {
  // Polytest Suite: GET v2_devmode_blocks_offset

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      const result = await client.getBlockTimeStampOffset()

      expect(result).toMatchSnapshot()
      expect(result).toHaveProperty('offset')
      expect(typeof result.offset).toBe('number')
    })
  })
})