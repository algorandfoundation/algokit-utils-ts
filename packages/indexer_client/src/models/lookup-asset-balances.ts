import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  bigIntCodec,
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
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

export const LookupAssetBalancesMeta: ObjectModelMetadata<LookupAssetBalances> = {
  name: 'LookupAssetBalances',
  kind: 'object',
  fields: [
    {
      name: 'balances',
      wireKey: 'balances',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(MiniAssetHoldingMeta)),
    },
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'nextToken',
      wireKey: 'next-token',
      optional: true,
      codec: stringCodec,
    },
  ],
}
