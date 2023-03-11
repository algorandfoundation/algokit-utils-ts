import { describe, test } from '@jest/globals'
import algosdk from 'algosdk'
import { readFile } from 'fs/promises'
import path from 'path'
import { localNetFixture } from '../tests/fixtures/localnet-fixture'
import { getTestAccount } from './account'
import { AlgoAmount } from './algo-amount'
import { createApp } from './app'
import { getStorageSchemaFromAppSpec, replaceDeployTimeControlParams } from './deploy-app'
import { lookupAccountCreatedApplicationByAddress, lookupTransactionById, searchTransactions } from './indexer-lookup'
import { sendTransaction } from './transaction'

describe('indexer-lookup', () => {
  const localnet = localNetFixture()

  const getTestTransaction = async (amount?: number, from?: string) => {
    return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: from ?? localnet.context.testAccount.addr,
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

  test('Transactions are searched with pagination', async () => {
    const { client, indexer, testAccount, transactionLogger } = localnet.context
    const secondAccount = await getTestAccount({
      client,
      initialFunds: AlgoAmount.Algos(1),
      suppressLog: true,
    })
    const { transaction: transaction1 } = await sendTransaction(client, await getTestTransaction(1), testAccount)
    const { transaction: transaction2 } = await sendTransaction(client, await getTestTransaction(1), testAccount)
    await sendTransaction(client, await getTestTransaction(1, secondAccount.addr), secondAccount)
    await transactionLogger.waitForIndexer(indexer)

    const transactions = await searchTransactions(indexer, (s) => s.txType('pay').addressRole('sender').address(testAccount.addr), 1)

    expect(Number(transactions['current-round'])).toBeGreaterThan(0)
    expect(transactions.transactions.map((t) => t.id).sort()).toEqual([transaction1.txID(), transaction2.txID()].sort())
  })

  test('Application create transactions are found by creator with pagination', async () => {
    const { client, indexer, testAccount } = localnet.context
    const secondAccount = await getTestAccount({
      client,
      initialFunds: AlgoAmount.Algos(1),
      suppressLog: true,
    })
    const appSpecFile = await readFile(path.join(__dirname, '..', 'tests', 'example-contracts', 'hello-world', 'application.json'))
    const appSpec = JSON.parse(await appSpecFile.toString('utf-8'))
    const createParams = {
      from: testAccount,
      approvalProgram: replaceDeployTimeControlParams(Buffer.from(appSpec.source.approval, 'base64').toString('utf-8'), {
        updatable: false,
        deletable: false,
      }),
      clearProgram: Buffer.from(appSpec.source.clear, 'base64').toString('utf-8'),
      schema: getStorageSchemaFromAppSpec(appSpec),
    }
    const app1 = await createApp(createParams, client)
    const app2 = await createApp(createParams, client)
    const app3 = await createApp({ ...createParams, from: secondAccount }, client)

    const apps = await lookupAccountCreatedApplicationByAddress(indexer, testAccount.addr, true, 1)

    expect(apps.map((a) => a.id).sort()).toEqual([app1.appIndex, app2.appIndex].sort())
  })
})
