import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bigIntCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { AssetParams } from './asset-params'
import { AssetParamsMeta } from './asset-params'

/**
 * Specifies both the unique identifier and the parameters for an asset
 */
export type Asset = {
  /**
   * unique asset identifier
   */
  id: bigint
  params: AssetParams
}

export const AssetMeta: ObjectModelMetadata<Asset> = {
  name: 'Asset',
  kind: 'object',
  fields: [
    {
      name: 'id',
      wireKey: 'index',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'params',
      wireKey: 'params',
      optional: false,
      codec: new ObjectModelCodec(AssetParamsMeta),
    },
  ],
}
