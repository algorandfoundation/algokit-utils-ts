import { describe, test } from 'vitest'

describe('GET v2_blocks_ROUND', () => {
  // Polytest Suite: GET v2_blocks_ROUND

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      // const client = new AlgodClient({
      //   baseUrl: `https://testnet-api.algonode.cloud`,
      // })
      // const result = await client.block(TEST_ROUND)
      // expect(result).toMatchSnapshot()
      // This can be removed once we have a good selection of mocked blocks
      // const mainnetClient = new AlgodClient({
      //   baseUrl: `https://mainnet-api.4160.nodely.dev`,
      // })
      // const result2 = await mainnetClient.block(24098947) // Confirms fix for genesisId/genesisHash population
      // expect(result2).toMatchSnapshot()
      // const result3 = await mainnetClient.block(55240407)
      // expect(result3).toMatchSnapshot()
      // const result4 = await mainnetClient.block(35600004) // stpf in block
      // expect(result4).toMatchSnapshot()
    })
  })
})
