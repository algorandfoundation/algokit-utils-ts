import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
} from '@algorandfoundation/algokit-common'

export type GetBlockHash = {
  /**
   * Block header hash.
   */
  blockHash: string
}

export const GetBlockHashMeta: ObjectModelMetadata<GetBlockHash> = {
  name: 'GetBlockHash',
  kind: 'object',
  fields: [
    {
      name: 'blockHash',
      wireKey: 'blockHash',
      optional: false,
      codec: stringCodec,
    },
  ],
}
