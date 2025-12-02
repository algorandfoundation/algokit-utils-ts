import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { numberCodec } from '@algorandfoundation/algokit-common'

export type GetBlockTimeStampOffsetResponse = {
  /**
   * Timestamp offset in seconds.
   */
  offset: number
}

export const GetBlockTimeStampOffsetResponseMeta: ObjectModelMetadata<GetBlockTimeStampOffsetResponse> = {
  name: 'GetBlockTimeStampOffsetResponse',
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
