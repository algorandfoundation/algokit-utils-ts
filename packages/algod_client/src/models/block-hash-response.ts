import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
} from '@algorandfoundation/algokit-common'

export type BlockHashResponse = {
  /**
   * Block header hash.
   */
  blockHash: string
}

export const BlockHashResponseMeta: ObjectModelMetadata<BlockHashResponse> = {
  name: 'BlockHashResponse',
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
