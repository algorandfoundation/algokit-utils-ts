import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

export type RawTransaction = {
  /**
   * encoding of the transaction hash.
   */
  txId: string
}

export const RawTransactionMeta: ObjectModelMetadata = {
  name: 'RawTransaction',
  kind: 'object',
  fields: [
    {
      name: 'txId',
      wireKey: 'txId',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
