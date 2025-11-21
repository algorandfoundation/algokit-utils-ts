import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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

export const LookupAccountAssetsMeta: ObjectModelMetadata = {
  name: 'LookupAccountAssets',
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
      name: 'assets',
      wireKey: 'assets',
      optional: false,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(AssetHoldingMeta)),
    },
  ],
}
