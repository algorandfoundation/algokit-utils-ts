import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
} from '@algorandfoundation/algokit-common'

/**
 * Supply represents the current supply of MicroAlgos in the system
 */
export type SupplyResponse = {
  /**
   * Round
   */
  currentRound: bigint

  /**
   * OnlineMoney
   */
  onlineMoney: bigint

  /**
   * TotalMoney
   */
  totalMoney: bigint
}

export const SupplyResponseMeta: ObjectModelMetadata<SupplyResponse> = {
  name: 'SupplyResponse',
  kind: 'object',
  fields: [
    {
      name: 'currentRound',
      wireKey: 'current_round',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'onlineMoney',
      wireKey: 'online-money',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'totalMoney',
      wireKey: 'total-money',
      optional: false,
      codec: bigIntCodec,
    },
  ],
}
