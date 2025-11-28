import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { Asset } from './asset'
import { AssetMeta } from './asset'

export type LookupAssetById = {
  asset: Asset

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint
}

export const LookupAssetByIdMeta: ObjectModelMetadata<LookupAssetById> = {
  name: 'LookupAssetById',
  kind: 'object',
  fields: [
    {
      name: 'asset',
      wireKey: 'asset',
      optional: false,
      codec: new ObjectModelCodec(AssetMeta),
    },
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      codec: bigIntCodec,
    },
  ],
}
