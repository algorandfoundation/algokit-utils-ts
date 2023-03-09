import { describe, test } from '@jest/globals'
import algosdk from 'algosdk'
import { localnetFixture as localNetFixture } from '../tests/fixtures/localnet-fixture'
import { lookupTransactionById } from './indexer-lookup'
import { sendTransaction } from './transaction'

describe('indexer-lookup', () => {
  const localnet = localNetFixture()

  const getTestTransaction = async (amount?: number) => {
    return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: localnet.context.testAccount.addr,
      to: localnet.context.testAccount.addr,
      amount: amount ?? 1,
      suggestedParams: await localnet.context.client.getTransactionParams().do(),
    })
  }

  test('Transaction is found by id', async () => {
    const { client, indexer, testAccount, transactionLogger } = localnet.context
    const { transaction } = await sendTransaction(client, await getTestTransaction(), testAccount)
    await transactionLogger.waitForIndexer(indexer)

    const txn = await lookupTransactionById(indexer, transaction.txID())

    expect(txn.transaction.id).toBe(transaction.txID())
    expect(txn['current-round']).toBeGreaterThanOrEqual(transaction.firstRound)
  })
})
