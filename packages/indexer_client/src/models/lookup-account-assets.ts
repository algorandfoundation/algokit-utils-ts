import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  bigIntCodec,
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { AssetHolding } from './asset-holding'
import { AssetHoldingMeta } from './asset-holding'

export type LookupAccountAssets = {
  /**
   * Round at which the results were computed.
   */
  currentRound: bigint

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
  assets: AssetHolding[]
}

export const LookupAccountAssetsMeta: ObjectModelMetadata<LookupAccountAssets> = {
  name: 'LookupAccountAssets',
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
      name: 'assets',
      wireKey: 'assets',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(AssetHoldingMeta)),
    },
  ],
}
