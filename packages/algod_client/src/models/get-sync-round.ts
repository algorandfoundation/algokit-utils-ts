import type { ModelMetadata } from '../core/model-runtime'

export type GetSyncRound = {
  /**
   * The minimum sync round for the ledger.
   */
  round: bigint
}

export const GetSyncRoundMeta: ModelMetadata = {
  name: 'GetSyncRound',
  kind: 'object',
  fields: [
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
  ],
}
