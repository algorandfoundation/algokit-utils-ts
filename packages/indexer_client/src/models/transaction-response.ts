import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { Transaction } from './transaction'
import { TransactionMeta } from './transaction'

export type TransactionResponse = {
  transaction: Transaction

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint
}

export const TransactionResponseMeta: ObjectModelMetadata<TransactionResponse> = {
  name: 'TransactionResponse',
  kind: 'object',
  fields: [
    {
      name: 'transaction',
      wireKey: 'transaction',
      optional: false,
      codec: new ObjectModelCodec(TransactionMeta),
    },
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      codec: bigIntCodec,
    },
  ],
}
