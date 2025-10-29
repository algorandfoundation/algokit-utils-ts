import type { ModelMetadata } from '../core/model-runtime'
import type { MiniAssetHolding } from './mini-asset-holding'
import { MiniAssetHoldingMeta } from './mini-asset-holding'

export type LookupAssetBalances = {
  balances: MiniAssetHolding[]

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
}

export const LookupAssetBalancesMeta: ModelMetadata = {
  name: 'LookupAssetBalances',
  kind: 'object',
  fields: [
    {
      name: 'balances',
      wireKey: 'balances',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => MiniAssetHoldingMeta } },
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
