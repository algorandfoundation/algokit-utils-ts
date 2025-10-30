import { AlgodClient } from '@algorandfoundation/algod-client'
import { decodeSignedTransaction, getTransactionId } from '@algorandfoundation/algokit-transact'
import * as algosdk from '@algorandfoundation/sdk'
import { Config } from '../config'
import { runWhenIndexerCaughtUp } from './indexer'
import Indexer = algosdk.Indexer

/**
 * Allows you to keep track of Algorand transaction IDs by wrapping an `AlgodClient` in a proxy.
 * Useful for automated tests.
 */
export class TransactionLogger {
  private _sentTransactionIds: string[] = []
  private _latestLastValidRound?: bigint

  private _pushTxn(stxn: Uint8Array) {
    const decoded = decodeSignedTransaction(stxn)
    if (decoded.txn.lastValid > (this._latestLastValidRound ?? BigInt(0))) {
      this._latestLastValidRound = decoded.txn.lastValid
    }
    this._sentTransactionIds.push(getTransactionId(decoded.txn))
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

  /** Return a proxy that wraps the given AlgodClient with this transaction logger.
   *
   * @param algod The `AlgodClient` to wrap
   * @returns The wrapped `AlgodClient`, any transactions sent using this algod instance will be logged by this transaction logger
   */
  capture(algod: AlgodClient): AlgodClient {
    return new Proxy<AlgodClient>(algod, new TransactionLoggingAlgodClientProxyHandler(this))
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

class TransactionLoggingAlgodClientProxyHandler implements ProxyHandler<AlgodClient> {
  private transactionLogger: TransactionLogger

  constructor(transactionLogger: TransactionLogger) {
    this.transactionLogger = transactionLogger
  }

  // TODO: PD - restore this logic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(target: AlgodClient, property: string | symbol, receiver: any) {
    if (property === 'rawTransaction') {
      return ({ body: stxOrStxs }: { body: Uint8Array | Uint8Array[] }) => {
        this.transactionLogger.logRawTransaction(stxOrStxs)

        let forPosting = stxOrStxs
        if (Array.isArray(stxOrStxs)) {
          if (!stxOrStxs.every(isByteArray)) {
            throw new TypeError('Array elements must be byte arrays')
          }
          // Flatten into a single Uint8Array
          forPosting = algosdk.concatArrays(...stxOrStxs)
        } else if (!isByteArray(forPosting)) {
          throw new TypeError('Argument must be byte array')
        }

        return target[property].call(receiver, { body: forPosting })
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (target as any)[property]
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isByteArray(array: any): array is Uint8Array {
  return array && array.byteLength !== undefined
}
