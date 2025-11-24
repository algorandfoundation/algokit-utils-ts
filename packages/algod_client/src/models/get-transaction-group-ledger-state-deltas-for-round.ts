import type { ModelMetadata } from '../core/model-runtime'
import type { LedgerStateDeltaForTransactionGroup } from './ledger-state-delta-for-transaction-group'
import { LedgerStateDeltaForTransactionGroupMeta } from './ledger-state-delta-for-transaction-group'

export type GetTransactionGroupLedgerStateDeltasForRound = {
  deltas: LedgerStateDeltaForTransactionGroup[]
}

export const GetTransactionGroupLedgerStateDeltasForRoundMeta: ModelMetadata = {
  name: 'GetTransactionGroupLedgerStateDeltasForRound',
  kind: 'object',
  fields: [
    {
      name: 'deltas',
      wireKey: 'Deltas',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => LedgerStateDeltaForTransactionGroupMeta } },
    },
  ],
}
