import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { AssetHolding } from './asset-holding'
import { AssetHoldingMeta } from './asset-holding'
import type { AssetParams } from './asset-params'
import { AssetParamsMeta } from './asset-params'

export type AccountAssetInformation = {
  /**
   * The round for which this information is relevant.
   */
  round: bigint
  assetHolding?: AssetHolding
  createdAsset?: AssetParams
}

export const AccountAssetInformationMeta: ObjectModelMetadata = {
  name: 'AccountAssetInformation',
  kind: 'object',
  fields: [
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'assetHolding',
      wireKey: 'asset-holding',
      optional: true,
      nullable: false,
      codec: new ModelCodec(AssetHoldingMeta),
    },
    {
      name: 'createdAsset',
      wireKey: 'created-asset',
      optional: true,
      nullable: false,
      codec: new ModelCodec(AssetParamsMeta),
    },
  ],
}
