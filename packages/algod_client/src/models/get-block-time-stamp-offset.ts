import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
} from '@algorandfoundation/algokit-common'

export type GetBlockTimeStampOffset = {
  /**
   * Timestamp offset in seconds.
   */
  offset: number
}

export const GetBlockTimeStampOffsetMeta: ObjectModelMetadata<GetBlockTimeStampOffset> = {
  name: 'GetBlockTimeStampOffset',
  kind: 'object',
  fields: [
    {
      name: 'offset',
      wireKey: 'offset',
      optional: false,
      codec: numberCodec,
    },
  ],
}
