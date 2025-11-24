import type { ModelMetadata } from '../core/model-runtime'

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

export const GetSupplyMeta: ModelMetadata = {
  name: 'GetSupply',
  kind: 'object',
  fields: [
    {
      name: 'currentRound',
      wireKey: 'current_round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'onlineMoney',
      wireKey: 'online-money',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'totalMoney',
      wireKey: 'total-money',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
  ],
}
