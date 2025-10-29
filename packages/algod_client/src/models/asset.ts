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
      name: 'params',
      wireKey: 'params',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => AssetParamsMeta },
    },
  ],
}
