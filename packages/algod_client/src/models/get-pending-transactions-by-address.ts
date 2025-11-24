import type { ModelMetadata } from '../core/model-runtime'
import type { SignedTransaction } from '@algorandfoundation/algokit-transact'

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
  totalTransactions: bigint
}

export const GetPendingTransactionsByAddressMeta: ModelMetadata = {
  name: 'GetPendingTransactionsByAddress',
  kind: 'object',
  fields: [
    {
      name: 'topTransactions',
      wireKey: 'top-transactions',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'codec', codecKey: 'SignedTransaction' } },
    },
    {
      name: 'totalTransactions',
      wireKey: 'total-transactions',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
