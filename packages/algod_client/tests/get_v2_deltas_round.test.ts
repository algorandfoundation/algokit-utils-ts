import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src/client'

describe('GET v2_deltas_ROUND', () => {
  // Polytest Suite: GET v2_deltas_ROUND

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // TODO: Fix msgpack response handling in PollyJS mock server
    test('Basic request and response validation', async () => {
      const client = new AlgodClient({
        baseUrl: `https://mainnet-api.4160.nodely.dev`,
      })

      const result = await client.getLedgerStateDelta(55240407n)
      expect(result).toMatchSnapshot()
    })
  })
})
