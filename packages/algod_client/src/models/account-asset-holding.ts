import type { ModelMetadata } from '../core/model-runtime'
import type { AssetHolding } from './asset-holding'
import { AssetHoldingMeta } from './asset-holding'
import type { AssetParams } from './asset-params'
import { AssetParamsMeta } from './asset-params'

/**
 * AccountAssetHolding describes the account's asset holding and asset parameters (if either exist) for a specific asset ID.
 */
export type AccountAssetHolding = {
  assetHolding: AssetHolding
  assetParams?: AssetParams
}

export const AccountAssetHoldingMeta: ModelMetadata = {
  name: 'AccountAssetHolding',
  kind: 'object',
  fields: [
    {
      name: 'assetHolding',
      wireKey: 'asset-holding',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => AssetHoldingMeta },
    },
    {
      name: 'assetParams',
      wireKey: 'asset-params',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => AssetParamsMeta },
    },
  ],
}
