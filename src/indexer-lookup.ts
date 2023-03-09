import { Indexer } from 'algosdk'
import { TransactionLookupResult } from './indexer-type'

/**
 * Looks up a transaction by ID using Indexer.
 * @param indexer An indexer client
 * @param transactionId The ID of the transaction to look up
 * @returns The result of the look-up
 */
export async function lookupTransactionById(indexer: Indexer, transactionId: string): Promise<TransactionLookupResult> {
  return (await indexer.lookupTransactionByID(transactionId).do()) as TransactionLookupResult
}
