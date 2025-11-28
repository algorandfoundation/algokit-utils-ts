import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  booleanCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
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

  /**
   * Whether or not this asset is currently deleted.
   */
  deleted?: boolean

  /**
   * Round during which this asset was created.
   */
  createdAtRound?: bigint

  /**
   * Round during which this asset was destroyed.
   */
  destroyedAtRound?: bigint
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
      name: 'deleted',
      wireKey: 'deleted',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'createdAtRound',
      wireKey: 'created-at-round',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'destroyedAtRound',
      wireKey: 'destroyed-at-round',
      optional: true,
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
