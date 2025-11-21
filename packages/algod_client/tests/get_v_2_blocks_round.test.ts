import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src/client'

describe('GET v2_blocks_ROUND', () => {
  // Polytest Suite: GET v2_blocks_ROUND

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // TODO: Fix msgpack response handling in PollyJS mock server
    test('Basic request and response validation', async () => {
      const client = new AlgodClient({
        baseUrl: `https://mainnet-api.4160.nodely.dev`,
      })

      // const result = await client.getBlock(TEST_ROUND)

      // expect(result).toMatchSnapshot()

      const result2 = await client.getBlock(24098947)
      expect(result2).toMatchSnapshot()

      const result3 = await client.getBlock(55240407)
      expect(result3).toMatchSnapshot()

      const result4 = await client.getBlock(35600004) // stpf in block
      expect(result4).toMatchSnapshot()
    })
  })
})
