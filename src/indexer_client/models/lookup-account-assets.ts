import type { ModelMetadata } from '../core/model-runtime'
import type { AssetHolding } from './asset-holding'
import { AssetHoldingMeta } from './asset-holding'

export type LookupAccountAssets = {
  /**
   * Round at which the results were computed.
   */
  currentRound: bigint

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
  assets: AssetHolding[]
}

export const LookupAccountAssetsMeta: ModelMetadata = {
  name: 'LookupAccountAssets',
  kind: 'object',
  fields: [
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
    {
      name: 'assets',
      wireKey: 'assets',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => AssetHoldingMeta } },
    },
  ],
}
