import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { Transaction } from './transaction'
import { TransactionMeta } from './transaction'

export type LookupTransaction = {
  transaction: Transaction

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint
}

export const LookupTransactionMeta: ObjectModelMetadata = {
  name: 'LookupTransaction',
  kind: 'object',
  fields: [
    {
      name: 'transaction',
      wireKey: 'transaction',
      optional: false,
      nullable: false,
      codec: new ModelCodec(TransactionMeta),
    },
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
  ],
}
