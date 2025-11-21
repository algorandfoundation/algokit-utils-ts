import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { Block } from './block'
import { BlockMeta } from './block'

export type SearchForBlockHeaders = {
  /**
   * Round at which the results were computed.
   */
  currentRound: bigint

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
  blocks: Block[]
}

export const SearchForBlockHeadersMeta: ObjectModelMetadata = {
  name: 'SearchForBlockHeaders',
  kind: 'object',
  fields: [
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'nextToken',
      wireKey: 'next-token',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'blocks',
      wireKey: 'blocks',
      optional: false,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(BlockMeta)),
    },
  ],
}
