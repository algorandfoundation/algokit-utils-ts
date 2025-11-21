import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

export type GetBlockHash = {
  /**
   * Block header hash.
   */
  blockHash: string
}

export const GetBlockHashMeta: ObjectModelMetadata = {
  name: 'GetBlockHash',
  kind: 'object',
  fields: [
    {
      name: 'blockHash',
      wireKey: 'blockHash',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
