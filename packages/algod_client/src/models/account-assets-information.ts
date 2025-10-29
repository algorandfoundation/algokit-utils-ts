import type { ModelMetadata } from '../core/model-runtime'
import type { AccountAssetHolding } from './account-asset-holding'
import { AccountAssetHoldingMeta } from './account-asset-holding'

export type AccountAssetsInformation = {
  /**
   * The round for which this information is relevant.
   */
  round: bigint

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
  assetHoldings?: AccountAssetHolding[]
}

export const AccountAssetsInformationMeta: ModelMetadata = {
  name: 'AccountAssetsInformation',
  kind: 'object',
  fields: [
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'nextToken',
      wireKey: 'next-token',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'assetHoldings',
      wireKey: 'asset-holdings',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => AccountAssetHoldingMeta } },
    },
  ],
}
