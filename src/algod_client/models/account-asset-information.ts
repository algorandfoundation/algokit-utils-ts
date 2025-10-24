import type { ModelMetadata } from '../core/model-runtime'
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

export const AccountAssetInformationMeta: ModelMetadata = {
  name: 'AccountAssetInformation',
  kind: 'object',
  fields: [
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'assetHolding',
      wireKey: 'asset-holding',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => AssetHoldingMeta },
    },
    {
      name: 'createdAsset',
      wireKey: 'created-asset',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => AssetParamsMeta },
    },
  ],
}
