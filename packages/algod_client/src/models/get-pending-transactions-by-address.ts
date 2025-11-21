import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { SignedTransaction } from '@algorandfoundation/algokit-transact'
import { SignedTransactionMeta } from '@algorandfoundation/algokit-transact'

/**
 * PendingTransactions is an array of signed transactions exactly as they were submitted.
 */
export type GetPendingTransactionsByAddress = {
  /**
   * An array of signed transaction objects.
   */
  topTransactions: SignedTransaction[]

  /**
   * Total number of transactions in the pool.
   */
  totalTransactions: number
}

export const GetPendingTransactionsByAddressMeta: ObjectModelMetadata = {
  name: 'GetPendingTransactionsByAddress',
  kind: 'object',
  fields: [
    {
      name: 'topTransactions',
      wireKey: 'top-transactions',
      optional: false,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(SignedTransactionMeta)),
    },
    {
      name: 'totalTransactions',
      wireKey: 'total-transactions',
      optional: false,
      nullable: false,
      codec: numberCodec,
    },
  ],
}
