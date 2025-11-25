import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  bigIntCodec,
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { Transaction } from './transaction'
import { TransactionMeta } from './transaction'

export type LookupAccountTransactions = {
  /**
   * Round at which the results were computed.
   */
  currentRound: bigint

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
  transactions: Transaction[]
}

export const LookupAccountTransactionsMeta: ObjectModelMetadata = {
  name: 'LookupAccountTransactions',
  kind: 'object',
  fields: [
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'nextToken',
      wireKey: 'next-token',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'transactions',
      wireKey: 'transactions',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(TransactionMeta)),
    },
  ],
}
