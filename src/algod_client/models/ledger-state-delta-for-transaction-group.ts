import type { ModelMetadata } from '../core/model-runtime'
import type { LedgerStateDelta } from './ledger-state-delta'
import { LedgerStateDeltaMeta } from './ledger-state-delta'

/**
 * Contains a ledger delta for a single transaction group
 */
export type LedgerStateDeltaForTransactionGroup = {
  delta: LedgerStateDelta
  ids: string[]
}

export const LedgerStateDeltaForTransactionGroupMeta: ModelMetadata = {
  name: 'LedgerStateDeltaForTransactionGroup',
  kind: 'object',
  fields: [
    {
      name: 'delta',
      wireKey: 'Delta',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => LedgerStateDeltaMeta },
    },
    {
      name: 'ids',
      wireKey: 'Ids',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
  ],
}
