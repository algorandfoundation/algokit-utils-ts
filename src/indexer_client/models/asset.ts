import type { ModelMetadata } from '../core/model-runtime'
import type { AssetParams } from './asset-params'
import { AssetParamsMeta } from './asset-params'

/**
 * Specifies both the unique identifier and the parameters for an asset
 */
export type Asset = {
  /**
   * unique asset identifier
   */
  index: bigint

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

export const AssetMeta: ModelMetadata = {
  name: 'Asset',
  kind: 'object',
  fields: [
    {
      name: 'index',
      wireKey: 'index',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'deleted',
      wireKey: 'deleted',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'createdAtRound',
      wireKey: 'created-at-round',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'destroyedAtRound',
      wireKey: 'destroyed-at-round',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'params',
      wireKey: 'params',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => AssetParamsMeta },
    },
  ],
}
