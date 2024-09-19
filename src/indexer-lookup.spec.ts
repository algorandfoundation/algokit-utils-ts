import { beforeEach, describe, test } from '@jest/globals'
import { getTestingAppContract } from '../tests/example-contracts/testing-app/contract'
import { indexer } from './'
import { algorandFixture, runWhenIndexerCaughtUp } from './testing'
import { AlgoAmount } from './types/amount'

describe('indexer-lookup', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.beforeEach, 10_000)

  const sendTestTransaction = async (amount?: AlgoAmount, from?: string) => {
    return await localnet.context.algorand.send.payment({
      sender: from ?? localnet.context.testAccount.addr,
      receiver: localnet.context.testAccount.addr,
      amount: amount ?? (1).microAlgo(),
    })
  }

  test('Transaction is found by id', async () => {
    const { algorand, waitForIndexer } = localnet.context
    const { transaction } = await sendTestTransaction()
    await waitForIndexer()

    const txn = await indexer.lookupTransactionById(transaction.txID(), algorand.client.indexer)

    expect(txn.transaction.id).toBe(transaction.txID())
    expect(txn['current-round']).toBeGreaterThanOrEqual(transaction.firstRound)
  }, 20_000)

  test('Account is found by id', async () => {
    const { algorand, testAccount } = localnet.context
    await runWhenIndexerCaughtUp(() => indexer.lookupAccountByAddress(testAccount.addr, algorand.client.indexer))

    const account = await indexer.lookupAccountByAddress(testAccount.addr, algorand.client.indexer)

    expect(account.account.address).toBe(testAccount.addr)
  }, 20_000)

  test('Transactions are searched with pagination', async () => {
    const { algorand, testAccount, generateAccount, waitForIndexer } = localnet.context
    const secondAccount = await generateAccount({
      initialFunds: (1).algo(),
      suppressLog: true,
    })
    const { transaction: transaction1 } = await sendTestTransaction((1).microAlgo())
    const { transaction: transaction2 } = await sendTestTransaction((2).microAlgo())
    await sendTestTransaction((1).microAlgo(), secondAccount.addr)
    await waitForIndexer()

    const transactions = await indexer.searchTransactions(
      algorand.client.indexer,
      (s) => s.txType('pay').addressRole('sender').address(testAccount.addr),
      1,
    )

    expect(Number(transactions['current-round'])).toBeGreaterThan(0)
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
      defaultSender: testAccount.addr,
      deletable: false,
      updatable: false,
      deployTimeParams: { VALUE: 1 },
    })
    const { result: app1 } = await factory.create()
    const { result: app2 } = await factory.create({ deployTimeParams: { VALUE: 2 } })
    await factory.create({ sender: secondAccount.addr })
    await waitForIndexer()

    const apps = await indexer.lookupAccountCreatedApplicationByAddress(algorand.client.indexer, testAccount.addr, true, 1)

    expect(apps.map((a) => BigInt(a.id)).sort()).toEqual([app1.appId, app2.appId].sort())
  }, 20_000)
})
