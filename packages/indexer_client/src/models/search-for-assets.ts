import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  bigIntCodec,
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { Asset } from './asset'
import { AssetMeta } from './asset'

export type SearchForAssets = {
  assets: Asset[]

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
}

export const SearchForAssetsMeta: ObjectModelMetadata = {
  name: 'SearchForAssets',
  kind: 'object',
  fields: [
    {
      name: 'assets',
      wireKey: 'assets',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(AssetMeta)),
    },
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
  ],
}
