import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { ArrayCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { SignedTransaction } from '@algorandfoundation/algokit-transact'
import { SignedTransactionMeta } from '@algorandfoundation/algokit-transact'

/**
 * A transaction group to simulate.
 */
export type SimulateRequestTransactionGroup = {
  /**
   * An atomic transaction group.
   */
  txns: SignedTransaction[]
}

export const SimulateRequestTransactionGroupMeta: ObjectModelMetadata<SimulateRequestTransactionGroup> = {
  name: 'SimulateRequestTransactionGroup',
  kind: 'object',
  fields: [
    {
      name: 'txns',
      wireKey: 'txns',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(SignedTransactionMeta)),
    },
  ],
}
