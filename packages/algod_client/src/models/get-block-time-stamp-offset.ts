import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

export type GetBlockTimeStampOffset = {
  /**
   * Timestamp offset in seconds.
   */
  offset: number
}

export const GetBlockTimeStampOffsetMeta: ObjectModelMetadata = {
  name: 'GetBlockTimeStampOffset',
  kind: 'object',
  fields: [
    {
      name: 'offset',
      wireKey: 'offset',
      optional: false,
      nullable: false,
      codec: numberCodec,
    },
  ],
}
