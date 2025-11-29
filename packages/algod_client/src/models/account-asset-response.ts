import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bigIntCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { AssetHolding } from './asset-holding'
import { AssetHoldingMeta } from './asset-holding'
import type { AssetParams } from './asset-params'
import { AssetParamsMeta } from './asset-params'

export type AccountAssetResponse = {
  /**
   * The round for which this information is relevant.
   */
  round: bigint
  assetHolding?: AssetHolding
  createdAsset?: AssetParams
}

export const AccountAssetResponseMeta: ObjectModelMetadata<AccountAssetResponse> = {
  name: 'AccountAssetResponse',
  kind: 'object',
  fields: [
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'assetHolding',
      wireKey: 'asset-holding',
      optional: true,
      codec: new ObjectModelCodec(AssetHoldingMeta),
    },
    {
      name: 'createdAsset',
      wireKey: 'created-asset',
      optional: true,
      codec: new ObjectModelCodec(AssetParamsMeta),
    },
  ],
}
