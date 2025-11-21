import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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

export const AssetMeta: ObjectModelMetadata = {
  name: 'Asset',
  kind: 'object',
  fields: [
    {
      name: 'id',
      wireKey: 'index',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'params',
      wireKey: 'params',
      optional: false,
      nullable: false,
      codec: new ModelCodec(AssetParamsMeta),
    },
  ],
}
