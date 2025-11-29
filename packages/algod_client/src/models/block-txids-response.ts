import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringArrayCodec } from '@algorandfoundation/algokit-common'

export type BlockTxidsResponse = {
  /**
   * Block transaction IDs.
   */
  blockTxIds: string[]
}

export const BlockTxidsResponseMeta: ObjectModelMetadata<BlockTxidsResponse> = {
  name: 'BlockTxidsResponse',
  kind: 'object',
  fields: [
    {
      name: 'blockTxIds',
      wireKey: 'blockTxids',
      optional: false,
      codec: stringArrayCodec,
    },
  ],
}
