import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { TEST_ROUND } from './config'

describe('GET v2_blocks_ROUND', () => {
  // Polytest Suite: GET v2_blocks_ROUND

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // TODO: Re-enable once msgpack handling is fixed in mock server
    test.skip('Basic request and response validation', async () => {
      const client = new AlgodClient({
        baseUrl: `https://testnet-api.algonode.cloud`,
      })

      const result = await client.getBlock(TEST_ROUND)
      expect(result).toMatchSnapshot()

      // This can be removed once we have a good selection of mocked blocks
      // const mainnetClient = new AlgodClient({
      //   baseUrl: `https://mainnet-api.4160.nodely.dev`,
      // })
      // const result2 = await mainnetClient.getBlock(24098947)
      // expect(result2).toMatchSnapshot()
      // const result3 = await mainnetClient.getBlock(55240407)
      // expect(result3).toMatchSnapshot()
      // const result4 = await mainnetClient.getBlock(35600004) // stpf in block
      // expect(result4).toMatchSnapshot()
    })
  })
})
