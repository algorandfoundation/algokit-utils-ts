import { expect, it, describe } from 'vitest'
import { IndexerClient } from '@algorandfoundation/indexer-client'
import { createDummyAsset, getIndexerEnv, waitForIndexerTransaction } from './helpers'

describe('Indexer search transactions', () => {
  it('should search for transactions', async () => {
    const { assetId, txId } = await createDummyAsset()
    const env = getIndexerEnv()
    const client = new IndexerClient({ baseUrl: env.indexerBaseUrl, apiToken: env.indexerApiToken ?? undefined })

    await waitForIndexerTransaction(client, txId)

    const res = await client.searchForTransactions()
    expect(res).toHaveProperty('transactions')
    expect(res.transactions && res.transactions.length).toBeGreaterThan(0)

    const assetTxns = await client.searchForTransactions({ txType: 'acfg', assetId: assetId })
    expect(assetTxns).toHaveProperty('transactions')
    expect(assetTxns.transactions[0].createdAssetIndex).toBe(assetId)
  })
})
