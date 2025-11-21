import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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

export const SimulateRequestTransactionGroupMeta: ObjectModelMetadata = {
  name: 'SimulateRequestTransactionGroup',
  kind: 'object',
  fields: [
    {
      name: 'txns',
      wireKey: 'txns',
      optional: false,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(SignedTransactionMeta)),
    },
  ],
}
