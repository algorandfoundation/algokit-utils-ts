import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringArrayCodec,
} from '@algorandfoundation/algokit-common'

export type GetBlockTxIds = {
  /**
   * Block transaction IDs.
   */
  blockTxIds: string[]
}

export const GetBlockTxIdsMeta: ObjectModelMetadata<GetBlockTxIds> = {
  name: 'GetBlockTxIds',
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
