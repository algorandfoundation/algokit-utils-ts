import { expect, it, describe } from 'vitest'
import { IndexerClient } from '@algorandfoundation/indexer-client'
import { createDummyApp, getIndexerEnv, waitForIndexerTransaction } from './helpers'

describe('Indexer search applications', () => {
  it('should search for applications', async () => {
    const { appId, txId } = await createDummyApp()

    const env = getIndexerEnv()
    const client = new IndexerClient({ baseUrl: env.indexerBaseUrl, apiToken: env.indexerApiToken ?? undefined })

    await waitForIndexerTransaction(client, txId)

    const res = await client.searchForApplications()
    expect(res).toHaveProperty('applications')
    expect(res.applications && res.applications.length).toBeGreaterThan(0)

    const appTxns = await client.searchForApplications({ applicationId: appId })
    expect(appTxns).toHaveProperty('applications')
    expect(appTxns.applications && appTxns.applications.length).toBeGreaterThan(0)
    expect(appTxns.applications[0].id).toBe(appId)
  })
})
