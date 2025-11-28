import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
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

export const TransactionAssetConfigMeta: ObjectModelMetadata<TransactionAssetConfig> = {
  name: 'TransactionAssetConfig',
  kind: 'object',
  fields: [
    {
      name: 'assetId',
      wireKey: 'asset-id',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'params',
      wireKey: 'params',
      optional: true,
      codec: new ObjectModelCodec(AssetParamsMeta),
    },
  ],
}
