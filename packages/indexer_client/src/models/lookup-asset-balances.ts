import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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

export const LookupAssetBalancesMeta: ObjectModelMetadata = {
  name: 'LookupAssetBalances',
  kind: 'object',
  fields: [
    {
      name: 'balances',
      wireKey: 'balances',
      optional: false,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(MiniAssetHoldingMeta)),
    },
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'nextToken',
      wireKey: 'next-token',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
