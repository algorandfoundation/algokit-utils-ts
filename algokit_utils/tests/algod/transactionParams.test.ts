import { expect, it, describe } from 'vitest'
import { AlgodClient } from '@algorandfoundation/algod-client'
import { getAlgodEnv } from './helpers'

describe('transactionParams', () => {
  it('should fetch transaction params', async () => {
    const env = getAlgodEnv()
    const client = new AlgodClient({
      baseUrl: env.algodBaseUrl,
      apiToken: env.algodApiToken,
    })
    const sp = await client.transactionParams()
    expect(sp).toHaveProperty('genesisHash')
    expect(sp.genesisHash).toBeInstanceOf(Uint8Array)
    expect(sp).toHaveProperty('lastRound')
  })
})
