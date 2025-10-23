import { expect, it, describe } from 'vitest'
import { AlgodClient } from '@algorandfoundation/algod-client'

const ALGONODE_TESTNET_URL = 'https://testnet-api.algonode.cloud'

describe('Algod get block', () => {
  it('gets a block from the network', async () => {
    const client = new AlgodClient({
      baseUrl: ALGONODE_TESTNET_URL,
      apiToken: undefined,
    })
    const largeBlockWithStateProofTxns = 24098947
    const blockResponse = await client.getBlock(largeBlockWithStateProofTxns, { headerOnly: false })
    expect(blockResponse).toBeDefined()
    expect(blockResponse.cert).toBeDefined()
    expect(blockResponse.block.stateProofTracking).toBeDefined()
    expect(blockResponse.block.transactions?.length).toBeGreaterThan(0)

    // Validate deeply nested signed transaction fields are present and
    // leverage transact crate model
    const transactions = blockResponse.block.transactions
    expect(transactions).toBeDefined()
    expect(transactions.length).toBeGreaterThan(0)
    expect(transactions?.[0].signedTransaction.transaction.sender).toBe('XM6FEYVJ2XDU2IBH4OT6VZGW75YM63CM4TC6AV6BD3JZXFJUIICYTVB5EU')
  }, 30_000)
})
