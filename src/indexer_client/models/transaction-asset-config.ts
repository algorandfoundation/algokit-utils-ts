import type { ModelMetadata } from '../core/model-runtime'
import type { AssetParams } from './asset-params'
import { AssetParamsMeta } from './asset-params'

/**
 * Fields for asset allocation, re-configuration, and destruction.
 *
 *
 * A zero value for asset-id indicates asset creation.
 * A zero value for the params indicates asset destruction.
 *
 * Definition:
 * data/transactions/asset.go : AssetConfigTxnFields
 */
export type TransactionAssetConfig = {
  /**
   * \[xaid\] ID of the asset being configured or empty if creating.
   */
  assetId?: bigint
  params?: AssetParams
}

export const TransactionAssetConfigMeta: ModelMetadata = {
  name: 'TransactionAssetConfig',
  kind: 'object',
  fields: [
    {
      name: 'assetId',
      wireKey: 'asset-id',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'params',
      wireKey: 'params',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => AssetParamsMeta },
    },
  ],
}
