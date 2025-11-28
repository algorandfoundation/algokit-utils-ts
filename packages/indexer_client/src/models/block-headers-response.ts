import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  bigIntCodec,
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { Block } from './block'
import { BlockMeta } from './block'

export type BlockHeadersResponse = {
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

export const BlockHeadersResponseMeta: ObjectModelMetadata<BlockHeadersResponse> = {
  name: 'BlockHeadersResponse',
  kind: 'object',
  fields: [
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'nextToken',
      wireKey: 'next-token',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'blocks',
      wireKey: 'blocks',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(BlockMeta)),
    },
  ],
}
