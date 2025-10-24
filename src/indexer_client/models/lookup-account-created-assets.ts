import type { ModelMetadata } from '../core/model-runtime'
import type { Asset } from './asset'
import { AssetMeta } from './asset'

export type LookupAccountCreatedAssets = {
  assets: Asset[]

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
}

export const LookupAccountCreatedAssetsMeta: ModelMetadata = {
  name: 'LookupAccountCreatedAssets',
  kind: 'object',
  fields: [
    {
      name: 'assets',
      wireKey: 'assets',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => AssetMeta } },
    },
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'nextToken',
      wireKey: 'next-token',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
