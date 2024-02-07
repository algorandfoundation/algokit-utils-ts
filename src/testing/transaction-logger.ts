import algosdk from 'algosdk'
import { runWhenIndexerCaughtUp } from './indexer'
import Algodv2 = algosdk.Algodv2
import decodeSignedTransaction = algosdk.decodeSignedTransaction
import Indexer = algosdk.Indexer

/**
 * Allows you to keep track of Algorand transaction IDs by wrapping an `Algodv2` in a proxy.
 * Useful for automated tests.
 */
export class TransactionLogger {
  private _sentTransactionIds: string[] = []

  /**
   * The list of transaction IDs that has been logged thus far.
   */
  get sentTransactionIds(): Readonly<string[]> {
    return this._sentTransactionIds
  }

  /**
   * Clear all logged IDs.
   */
  clear() {
    this._sentTransactionIds = []
  }

  /**
   * The method that captures raw transactions and stores the transaction IDs.
   */
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

  /** Return a proxy that wraps the given Algodv2 with this transaction logger.
   *
   * @param algod The `Algodv2` to wrap
   * @returns The wrapped `Algodv2`, any transactions sent using this algod instance will be logged by this transaction logger
   */
  capture(algod: Algodv2): Algodv2 {
    return new Proxy<Algodv2>(algod, new TransactionLoggingAlgodv2ProxyHandler(this))
  }

  /** Wait until all logged transactions IDs appear in the given `Indexer`. */
  async waitForIndexer(indexer: Indexer) {
    await Promise.all(this._sentTransactionIds.map((txnId) => runWhenIndexerCaughtUp(() => indexer.lookupTransactionByID(txnId).do())))
  }
}

class TransactionLoggingAlgodv2ProxyHandler implements ProxyHandler<Algodv2> {
  private transactionLogger: TransactionLogger

  constructor(transactionLogger: TransactionLogger) {
    this.transactionLogger = transactionLogger
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(target: Algodv2, property: string | symbol, receiver: any) {
    if (property === 'sendRawTransaction') {
      return (stxOrStxs: Uint8Array | Uint8Array[]) => {
        this.transactionLogger.logRawTransaction(stxOrStxs)
        return target[property].call(receiver, stxOrStxs)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (target as any)[property]
  }
}
