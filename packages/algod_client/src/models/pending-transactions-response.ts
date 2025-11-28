import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { SignedTransaction } from '@algorandfoundation/algokit-transact'
import { SignedTransactionMeta } from '@algorandfoundation/algokit-transact'

/**
 * PendingTransactions is an array of signed transactions exactly as they were submitted.
 */
export type PendingTransactionsResponse = {
  /**
   * An array of signed transaction objects.
   */
  topTransactions: SignedTransaction[]

  /**
   * Total number of transactions in the pool.
   */
  totalTransactions: number
}

export const PendingTransactionsResponseMeta: ObjectModelMetadata<PendingTransactionsResponse> = {
  name: 'PendingTransactionsResponse',
  kind: 'object',
  fields: [
    {
      name: 'topTransactions',
      wireKey: 'top-transactions',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(SignedTransactionMeta)),
    },
    {
      name: 'totalTransactions',
      wireKey: 'total-transactions',
      optional: false,
      codec: numberCodec,
    },
  ],
}
