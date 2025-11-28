import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
} from '@algorandfoundation/algokit-common'

export type RawTransaction = {
  /**
   * encoding of the transaction hash.
   */
  txId: string
}

export const RawTransactionMeta: ObjectModelMetadata<RawTransaction> = {
  name: 'RawTransaction',
  kind: 'object',
  fields: [
    {
      name: 'txId',
      wireKey: 'txId',
      optional: false,
      codec: stringCodec,
    },
  ],
}
