import { describe, test } from '@jest/globals'
import algosdk from 'algosdk'
import { getTestingAppCreateParams } from '../tests/example-contracts/testing-app/contract'
import * as algokit from './'
import { algorandFixture } from './testing'

describe('indexer-lookup', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.beforeEach, 10_000)

  const getTestTransaction = async (amount?: number, from?: string) => {
    return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: from ?? localnet.context.testAccount.addr,
      to: localnet.context.testAccount.addr,
      amount: amount ?? 1,
      suggestedParams: await localnet.context.algod.getTransactionParams().do(),
    })
  }

  test('Transaction is found by id', async () => {
    const { algod, indexer, testAccount, transactionLogger } = localnet.context
    const { transaction } = await algokit.sendTransaction({ transaction: await getTestTransaction(), from: testAccount }, algod)
    await transactionLogger.waitForIndexer(indexer)

    const txn = await algokit.lookupTransactionById(transaction.txID(), indexer)

    expect(txn.transaction.id).toBe(transaction.txID())
    expect(txn['current-round']).toBeGreaterThanOrEqual(transaction.firstRound)
  })

  test('Account is found by id', async () => {
    const { indexer, testAccount, transactionLogger } = localnet.context
    await transactionLogger.waitForIndexer(indexer)

    const account = await algokit.lookupAccountByAddress(testAccount.addr, indexer)

    expect(account.account.address).toBe(testAccount.addr)
  })

  test('Transactions are searched with pagination', async () => {
    const { algod, indexer, testAccount, generateAccount, transactionLogger } = localnet.context
    const secondAccount = await generateAccount({
      initialFunds: algokit.algos(1),
      suppressLog: true,
    })
    const { transaction: transaction1 } = await algokit.sendTransaction(
      { transaction: await getTestTransaction(1), from: testAccount },
      algod,
    )
    const { transaction: transaction2 } = await algokit.sendTransaction(
      { transaction: await getTestTransaction(1), from: testAccount },
      algod,
    )
    await algokit.sendTransaction({ transaction: await getTestTransaction(1, secondAccount.addr), from: secondAccount }, algod)
    await transactionLogger.waitForIndexer(indexer)

    const transactions = await algokit.searchTransactions(
      indexer,
      (s) => s.txType('pay').addressRole('sender').address(testAccount.addr),
      1,
    )

    expect(Number(transactions['current-round'])).toBeGreaterThan(0)
    expect(transactions.transactions.map((t) => t.id).sort()).toEqual([transaction1.txID(), transaction2.txID()].sort())
  })

  test('Application create transactions are found by creator with pagination', async () => {
    const { algod, indexer, testAccount, generateAccount } = localnet.context
    const secondAccount = await generateAccount({
      initialFunds: algokit.algos(1),
      suppressLog: true,
    })
    const createParams = await getTestingAppCreateParams(testAccount, {
      name: 'test',
      version: '1.0',
      updatable: false,
      deletable: false,
    })
    const app1 = await algokit.createApp(createParams, algod)
    const app2 = await algokit.createApp(createParams, algod)
    await algokit.createApp({ ...createParams, from: secondAccount }, algod)

    const apps = await algokit.lookupAccountCreatedApplicationByAddress(indexer, testAccount.addr, true, 1)

    expect(apps.map((a) => a.id).sort()).toEqual([app1.appId, app2.appId].sort())
  })
})
