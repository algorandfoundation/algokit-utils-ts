import type { ModelMetadata } from '../core/model-runtime'
import type { SignedTransaction } from '@algorandfoundation/algokit-transact'

/**
 * A transaction group to simulate.
 */
export type SimulateRequestTransactionGroup = {
  /**
   * An atomic transaction group.
   */
  txns: SignedTransaction[]
}

export const SimulateRequestTransactionGroupMeta: ModelMetadata = {
  name: 'SimulateRequestTransactionGroup',
  kind: 'object',
  fields: [
    {
      name: 'txns',
      wireKey: 'txns',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'codec', codecKey: 'SignedTransaction' } },
    },
  ],
}
