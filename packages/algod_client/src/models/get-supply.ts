import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * Supply represents the current supply of MicroAlgos in the system
 */
export type GetSupply = {
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

export const GetSupplyMeta: ObjectModelMetadata = {
  name: 'GetSupply',
  kind: 'object',
  fields: [
    {
      name: 'currentRound',
      wireKey: 'current_round',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'onlineMoney',
      wireKey: 'online-money',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'totalMoney',
      wireKey: 'total-money',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
  ],
}
