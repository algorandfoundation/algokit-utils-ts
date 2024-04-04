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
  }, 20_000)

  test('Account is found by id', async () => {
    const { indexer, testAccount, transactionLogger } = localnet.context
    await transactionLogger.waitForIndexer(indexer)

    const account = await algokit.lookupAccountByAddress(testAccount.addr, indexer)

    expect(account.account.address).toBe(testAccount.addr)
  }, 20_000)

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
  }, 20_000)

  test('Application create transactions are found by creator with pagination', async () => {
    const { algod, indexer, testAccount, generateAccount, waitForIndexer } = localnet.context
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
    await waitForIndexer()

    const apps = await algokit.lookupAccountCreatedApplicationByAddress(indexer, testAccount.addr, true, 1)

    expect(apps.map((a) => a.id).sort()).toEqual([app1.appId, app2.appId].sort())
  }, 20_000)

  test('Asset transfer and creation transactions are found by search or by ID with amounts gt 53-bit', async () => {
    const { algod, indexer, testAccount, generateAccount, waitForIndexer } = localnet.context
    const secondAccount = await generateAccount({
      initialFunds: algokit.algos(1),
      suppressLog: true,
    })
    const asset = await algokit.createAsset(
      {
        creator: testAccount,
        total: 135_640_597_783_270_615n,
        decimals: 0,
      },
      algod,
    )
    await algokit.assetOptIn(
      {
        account: secondAccount,
        assetId: Number(asset.confirmation!.assetIndex),
      },
      algod,
    )
    const transfer = await algokit.transferAsset(
      {
        amount: 134_640_597_783_270_615n,
        from: testAccount,
        to: secondAccount,
        assetId: Number(asset.confirmation!.assetIndex),
      },
      algod,
    )
    const closeOut = await algokit.sendTransaction(
      {
        transaction: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          assetIndex: Number(asset.confirmation!.assetIndex),
          from: algokit.getSenderAddress(secondAccount),
          to: algokit.getSenderAddress(testAccount),
          closeRemainderTo: algokit.getSenderAddress(testAccount),
          amount: 257,
          suggestedParams: await algokit.getTransactionParams(undefined, algod),
        }),
        from: secondAccount,
      },
      algod,
    )
    await waitForIndexer()

    const searchTransactions = (await algokit.searchTransactions(indexer, (s) => s.assetID(Number(asset.confirmation!.assetIndex))))
      .transactions

    const acfgTxn = await algokit.lookupTransactionById(asset.transaction.txID(), indexer)
    const acfgTxnFromSearch = searchTransactions.find((t) => t.id === asset.transaction.txID())!
    expect(acfgTxn.transaction['asset-config-transaction']!.params!.total).toBe(135_640_597_783_270_615n)
    expect(acfgTxnFromSearch['asset-config-transaction']!.params!.total).toBe(135_640_597_783_270_615n)

    const axferTxn = await algokit.lookupTransactionById(transfer.transaction.txID(), indexer)
    const axferTxnFromSearch = searchTransactions.find((t) => t.id === transfer.transaction.txID())!
    expect(axferTxn.transaction['asset-transfer-transaction']!.amount).toBe(134_640_597_783_270_615n)
    expect(axferTxnFromSearch['asset-transfer-transaction']!.amount).toBe(134_640_597_783_270_615n)

    const closeOutTxn = await algokit.lookupTransactionById(closeOut.transaction.txID(), indexer)
    const closeOutTxnFromSearch = searchTransactions.find((t) => t.id === closeOut.transaction.txID())!
    expect(closeOutTxn.transaction['asset-transfer-transaction']!.amount).toBe(257)
    expect(closeOutTxnFromSearch['asset-transfer-transaction']!.amount).toBe(257)
    expect(closeOutTxn.transaction['asset-transfer-transaction']!['close-amount']).toBe(134_640_597_783_270_615n - 257n)
    expect(closeOutTxnFromSearch['asset-transfer-transaction']!['close-amount']).toBe(134_640_597_783_270_615n - 257n)
  }, 20_000)
})
