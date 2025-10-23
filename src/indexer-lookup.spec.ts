import { Address } from './sdk'
import { beforeEach, describe, expect, test } from 'vitest'
import { getTestingAppContract } from '../tests/example-contracts/testing-app/contract'
import * as indexer from './indexer-lookup'
import { algorandFixture, runWhenIndexerCaughtUp } from './testing'
import { AlgoAmount } from './types/amount'

describe('indexer-lookup', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.newScope, 10_000)

  const sendTestTransaction = async (amount?: AlgoAmount, from?: Address) => {
    return await localnet.context.algorand.send.payment({
      sender: from ?? localnet.context.testAccount,
      receiver: localnet.context.testAccount,
      amount: amount ?? (1).microAlgo(),
    })
  }

  test('Transaction is found by id', async () => {
    const { algorand, waitForIndexer } = localnet.context
    const { transaction } = await sendTestTransaction()
    await waitForIndexer()

    const txn = await algorand.client.indexer.lookupTransactionByID(transaction.txID()).do()

    expect(txn.transaction.id).toBe(transaction.txID())
    expect(txn.currentRound).toBeGreaterThanOrEqual(transaction.firstValid)
  }, 20_000)

  test('Account is found by id', async () => {
    const { algorand, testAccount } = localnet.context
    await runWhenIndexerCaughtUp(() => algorand.client.indexer.lookupAccountByID(testAccount.addr).do())

    const account = await algorand.client.indexer.lookupAccountByID(testAccount.addr).do()

    expect(account.account.address).toBe(testAccount.addr.toString())
  }, 20_000)

  test('Transactions are searched with pagination', async () => {
    const { algorand, testAccount, generateAccount, waitForIndexer } = localnet.context
    const secondAccount = await generateAccount({
      initialFunds: (1).algo(),
      suppressLog: true,
    })
    const { transaction: transaction1 } = await sendTestTransaction((1).microAlgo())
    const { transaction: transaction2 } = await sendTestTransaction((2).microAlgo())
    await sendTestTransaction((1).microAlgo(), secondAccount)
    await waitForIndexer()

    const transactions = await indexer.searchTransactions(
      algorand.client.indexer,
      (s) => s.txType('pay').addressRole('sender').address(testAccount),
      1,
    )

    expect(transactions.currentRound).toBeGreaterThan(0n)
    expect(transactions.transactions.map((t) => t.id).sort()).toEqual([transaction1.txID(), transaction2.txID()].sort())
  }, 20_000)

  test('Application create transactions are found by creator with pagination', async () => {
    const { algorand, testAccount, generateAccount, waitForIndexer } = localnet.context
    const secondAccount = await generateAccount({
      initialFunds: (1).algo(),
      suppressLog: true,
    })

    const app = await getTestingAppContract()
    const factory = algorand.client.getAppFactory({
      appSpec: app.appSpec,
      defaultSender: testAccount,
      deletable: false,
      updatable: false,
      deployTimeParams: { VALUE: 1 },
    })
    const { result: app1 } = await factory.send.bare.create()
    const { result: app2 } = await factory.send.bare.create({ deployTimeParams: { VALUE: 2 } })
    await factory.send.bare.create({ sender: secondAccount })
    await waitForIndexer()

    const apps = await indexer.lookupAccountCreatedApplicationByAddress(algorand.client.indexer, testAccount, true, 1)

    expect(apps.map((a) => BigInt(a.id)).sort()).toEqual([app1.appId, app2.appId].sort())
  }, 20_000)
})
