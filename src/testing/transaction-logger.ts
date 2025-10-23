import { Config } from '../config'
import * as algosdk from '../sdk'
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
  private _latestLastValidRound?: bigint

  private _pushTxn(stxn: Uint8Array) {
    const decoded = decodeSignedTransaction(stxn)
    if (decoded.txn.lastValid > (this._latestLastValidRound ?? BigInt(0))) {
      this._latestLastValidRound = BigInt(decoded.txn.lastValid)
    }
    this._sentTransactionIds.push(decoded.txn.txID())
  }

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
      signedTransactions.forEach((stxn) => this._pushTxn(stxn))
    } else {
      this._pushTxn(signedTransactions)
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
    if (this._sentTransactionIds.length === 0) return
    const lastTxId = this._sentTransactionIds[this._sentTransactionIds.length - 1]
    await runWhenIndexerCaughtUp(async () => {
      try {
        await indexer.lookupTransactionByID(lastTxId).do()
      } catch (e) {
        // If the txid lookup failed, then try to look up the last valid round
        // If that round exists, then we know indexer is caught up
        if (this._latestLastValidRound) {
          await indexer.lookupBlock(this._latestLastValidRound).do()
          Config.getLogger().debug(
            `waitForIndexer has waited until the last valid round ${this._latestLastValidRound} was indexed, but did not find transaction ${lastTxId} in the indexer.`,
          )
        } else {
          throw e
        }
      }
    })
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
