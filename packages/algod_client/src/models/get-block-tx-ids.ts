import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec } from '@algorandfoundation/algokit-common'

export type GetBlockTxIds = {
  /**
   * Block transaction IDs.
   */
  blockTxIds: string[]
}

export const GetBlockTxIdsMeta: ObjectModelMetadata = {
  name: 'GetBlockTxIds',
  kind: 'object',
  fields: [
    {
      name: 'blockTxIds',
      wireKey: 'blockTxids',
      optional: false,
      nullable: false,
      codec: new ArrayCodec(stringCodec),
    },
  ],
}
