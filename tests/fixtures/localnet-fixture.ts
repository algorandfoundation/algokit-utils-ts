/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach } from '@jest/globals'
import { Account, Algodv2, decodeSignedTransaction, Indexer } from 'algosdk'
import { AlgoAmount, getAlgoClient, getAlgoIndexerClient, getDefaultLocalNetConfig, getTestAccount } from '../../src'
import { lookupTransactionById } from '../../src/indexer-lookup'
import { TransactionLookupResult } from '../../src/indexer-type'

export const localnetFixture = (testAccountFunding?: AlgoAmount) => {
  const clientConfig = getDefaultLocalNetConfig('algod')
  const client = getAlgoClient(clientConfig)
  // todo: Sort out .env instead, cleaner and more flexible
  process.env.ALGOD_SERVER = clientConfig.server
  process.env.ALGOD_PORT = clientConfig.port?.toString() ?? ''
  process.env.ALGOD_TOKEN = clientConfig.token?.toString() ?? ''
  const indexer = getAlgoIndexerClient(getDefaultLocalNetConfig('indexer'))
  let context: AlgorandTestAutomationContext

  beforeEach(async () => {
    const transactionLogger = new TransactionLogger()
    const txnLoggingAlgod = new Proxy<Algodv2>(client, new TxnLoggingAlgodv2ProxyHandler(transactionLogger))
    const waitForIndexerTransaction = (txId: string) => runWhenIndexerCaughtUp(() => lookupTransactionById(indexer, txId))
    context = {
      client: txnLoggingAlgod,
      indexer: indexer,
      testAccount: await getTestAccount({ client, initialFunds: testAccountFunding ?? AlgoAmount.Algos(10), suppressLog: true }),
      transactionLogger: transactionLogger,
      waitForIndexerTransaction,
    }
  })

  return {
    get context() {
      return context
    },
  }
}

class TxnLoggingAlgodv2ProxyHandler implements ProxyHandler<Algodv2> {
  private transactionLogger: TransactionLogger

  constructor(transactionLogger: TransactionLogger) {
    this.transactionLogger = transactionLogger
  }

  get(target: Algodv2, property: string | symbol, receiver: any) {
    if (property === 'sendRawTransaction') {
      return (stxOrStxs: Uint8Array | Uint8Array[]) => {
        this.transactionLogger.logRawTransaction(stxOrStxs)
        return target[property].call(receiver, stxOrStxs)
      }
    }
    return (target as any)[property]
  }
}

export interface AlgorandTestAutomationContext {
  client: Algodv2
  indexer: Indexer
  transactionLogger: TransactionLogger
  testAccount: Account
  waitForIndexerTransaction: (txId: string) => Promise<TransactionLookupResult>
}

export class TransactionLogger {
  private _sentTransactionIds: string[] = []

  get sentTransactionIds(): Readonly<string[]> {
    return this._sentTransactionIds
  }

  logRawTransaction(signedTransactions: Uint8Array | Uint8Array[]) {
    if (Array.isArray(signedTransactions)) {
      for (const stxn of signedTransactions) {
        const decoded = decodeSignedTransaction(stxn)
        this._sentTransactionIds.push(decoded.txn.txID())
      }
    } else {
      const decoded = decodeSignedTransaction(signedTransactions)
      this._sentTransactionIds.push(decoded.txn.txID())
    }
  }

  async waitForIndexer(indexer: Indexer) {
    await Promise.all(this._sentTransactionIds.map((txnId) => runWhenIndexerCaughtUp(() => indexer.lookupTransactionByID(txnId).do())))
  }
}

async function runWhenIndexerCaughtUp<T>(run: () => Promise<T>): Promise<T> {
  let result: T | null = null
  let ok = false
  let tries = 0
  while (!ok) {
    try {
      result = await run()
      ok = true
    } catch (e: any) {
      if (e?.status === 404) {
        tries++
        if (tries > 20) {
          throw e
        }
        await new Promise<void>((resolve) => setTimeout(resolve, 200))
      } else {
        throw e
      }
    }
  }

  return result as T
}
